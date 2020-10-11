const express = require("express");
const _ = require("lodash");
const Joi = require("joi");
const auth = require("../../middleware/auth");
const Trip = require("../../models/trip");
const Bus = require("../../models/bus");
const User = require("../../models/User");
const googleMaps = require('../../api/maps');
const payHere = require('../../api/payhere');

const router = express.Router();

function validateTrip(trip) {
    const schema = {
        bus: Joi.string().min(5).required().label("Bus"),
        start: Joi.object().required().label("Start Location")
    };
    return Joi.validate(trip, schema);
}

function updateRequestValidate(trip) {
    const schema = {
        tripID: Joi.string().required().label("Trip ID"),
        location: Joi.object().required().label("Location")
    }
    return Joi.validate(trip, schema);
}

router.post("/new", auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user.wallet.debt > 50) return res.status(403).send({ message: "Trip creation abort due to debts" });

    const activeTrip = await getActiveTrip(req.user);
    if (activeTrip) return res.status(403).send({ message: "There exist another active trip" })

    const { error } = validateTrip(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const trip = new Trip();
    const bus = await Bus.findOne({ busNo: req.body.bus });
    if (!bus) return res.status(404).send({ message: "Bus not registered." })

    trip.bus = {
        number: bus.busNo,
        driver: bus.personals.driver,
        conductor: bus.personals.conductor,
    }
    trip.passenger = req.user.id;

    const start_location = await googleMaps.getAddress(req.body.start.lat, req.body.start.lng);
    trip.start = start_location;
    trip.start.time = Date.now();
    await trip.save();
    res.send(trip);

});

router.post("/active", auth, async (req, res) => {
    const activeTrip = await getActiveTrip(req.user);
    if (!activeTrip) return res.status(404).send({ message: "No active trip found" });
    return res.status(200).send(activeTrip);
});

router.post("/end", auth, async (req, res) => {
    const trip = await Trip.findOne({ _id: req.body.tripID });
    if (!trip) return res.status(401).message('Trip not found');
    trip.end = await googleMaps.getAddress(req.body.location.lat, req.body.location.lng);
    trip.end.time = Date.now();
    const user = await User.findById(req.user.id);
    const tripInfo = await getTripInfo(trip);

    const tripSummary = {
        id: trip._id,
        passenger: trip.passenger,
        bus: trip.bus.number
    }

    const payment = await user.chargeFromPrimaryMethod("Bus fare", tripInfo.fare.value, tripSummary);
    console.log(payment);
    trip.fare.amount = tripInfo.fare
    if (payment.status_code == 2) {
        trip.isPaid = true;
        trip.fare.payment.method = `${payment.meta.method} (${payment.meta.cardDetails.cardDetails.cardMask})`;
    }

    //we try to recover the payment from wallet prepaid balance 
    else {
        if (user.wallet.prepaidBalance > payment.amount.value) {
            const wallet_payment = await user.chargeFromWallet("Bus fare", tripInfo.fare.value, tripSummary);
            if (wallet_payment.status_code == 2) {
                trip.isPaid = true;
                trip.fare.payment.method = `${payment.meta.method} (${payment.meta.cardDetails.cardDetails.cardMask})`;
            }
        } else {
            wallet.debt = wallet.debt + payment.amount.value
        }
    }

    trip.distance = {
        distance: tripInfo.trip.distance,
        time: tripInfo.trip.time,
    }
    trip.isCompleted = true;

    await trip.save();

    res.status(200).send(_.pick(trip, ["bus", "start", "end", "fare", "isPaid", "isCompleted", "distance"]));
});

router.get("/all-trips", auth, async (req, res) => {
    const trips = await Trip.find({ passenger: req.user.id }).select('-cordes -distance -bus.conductor -bus.driver -fare.payment -end.geometry -start.geometry');
    if (!trips) return res.status(404).send({ message: "Not found any trips" });
    res.status(200).send(trips);
});

const getActiveTrip = async (passenger) => {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    const activeTrip = await Trip.findOne({ created_at: { $gte: start, $lt: end }, isCompleted: false, passenger: passenger.id });
    return activeTrip;
}

const getTripInfo = async (trip) => {
    const start = trip.start.cordes;
    const end = trip.end.cordes;
    const result = await googleMaps.getDistance(start, end);
    const distance = result.distance.value;
    let price = parseFloat(process.env.MINIMUM_FARE);
    let additional_fare = parseFloat(process.env.ADDITIONAL_FARE);
    if (distance > 1000) {
        price += Math.ceil((distance - 1000) / 1000) * additional_fare
    }
    const time_diff_miliseconds = Math.abs(trip.start.time - trip.end.time);
    const time_diff_minutes = Math.ceil((time_diff_miliseconds / 1000) / 60);
    const time_diff_text = time_diff_minutes + " mins";

    const tripSummary = {
        fare: {
            text: `${price} LKR`,
            value: price
        },
        trip: { ..._.pick(result, ['distance']), time: time_diff_text }
    }
    console.log(tripSummary);
    return tripSummary;
}

module.exports = router;
