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
    trip.cordes.push(req.body.start);

    const start_location = await googleMaps.getAddress(req.body.start.lat, req.body.start.lng);
    trip.start = start_location;
    await trip.save();
    res.send(trip);

});

router.post("/active", auth, async (req, res) => {
    const activeTrip = await getActiveTrip(req.user);
    if (!activeTrip) return res.status(404).send({ message: "No active trip found" });
    return res.status(200).send(activeTrip);
});

router.post("/update", auth, async (req, res) => {
    const { error } = updateRequestValidate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const trip = await Trip.findOne({ _id: req.body.tripID, passenger: req.user.id });
    if (!trip) res.status(404).send({ error: "Trip object not found" });
    trip.cordes.push(req.body.location);
    trip.save();
    res.status(200).send();
});


router.post("/end", auth, async (req, res) => {
    const trip = await Trip.findOne({ _id: req.body.tripID });
    if (!trip) return res.status(401).message('Trip not found');
    trip.cordes.push(req.body.location);
    await trip.save();
    const user = await User.findById(req.user.id);
    const tripInfo = await getTripInfo(trip.cordes);
    const payMethod = user.getPrimaryPayMethod();
    const payment = await payHere.charge({
        amount: tripInfo.fare.value,
        items: `Bus fare ${trip.id}`,
        order_id: trip.id,
        customer_token: payMethod.token
    });
    trip.fare.amount = tripInfo.fare
    if (payment.status == 1) {
        trip.isPaid = true;
        trip.fare.payment.method = `${payMethod.method}(${payMethod.cardDetails.cardMask})`;
    }
    trip.end = tripInfo.trip.end;
    trip.distance = {
        distance: tripInfo.trip.distance,
        time: tripInfo.trip.time,
    }
    trip.isCompleted = true;

    await trip.save();

    res.status(200).send(_.pick(trip, ["bus", "start", "end", "fare", "isPaid", "isCompleted", "distance"]));
});

const getActiveTrip = async (passenger) => {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    const activeTrip = await Trip.findOne({ created_at: { $gte: start, $lt: end }, isCompleted: false, passenger: passenger.id });
    return activeTrip;
}

const getTripInfo = async (cords) => {
    const length = cords.length;
    const start = cords[0];
    const end = cords[length - 1];
    const result = await googleMaps.getDistance(start, end);
    const distance = result.distance.value;
    let price = parseFloat(process.env.MINIMUM_FARE);
    let additional_fare = parseFloat(process.env.ADDITIONAL_FARE);
    if (distance > 1000) {
        price += Math.ceil((distance - 1000) / 1000) * additional_fare
    }
    const end_location = await googleMaps.getAddress(end.lat, end.lng);
    const tripSummary = {
        fare: {
            text: `${price} LKR`,
            value: price
        },
        trip: { ..._.pick(result, ['distance', 'time']), end: end_location }
    }
    console.log(tripSummary);
    return tripSummary;
}

module.exports = router;
