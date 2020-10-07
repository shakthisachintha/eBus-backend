const express = require("express");
const auth = require("../../middleware/auth");
const Trip = require("../../models/trip");
const Joi = require("joi");
const _ = require("lodash");
const googleMaps = require('../../api/maps');
const payHere = require('../../api/payhere');
const { info } = require("winston");
const User = require("../../models/User");

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

    const { error } = validateTrip(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const trip = new Trip();
    trip.bus = req.body.bus;
    trip.passenger = req.user.id;
    trip.cordes.push(req.body.start);

    const start_location = await googleMaps.getAddress(req.body.start.lat, req.body.start.lng);
    trip.start = start_location;
    trip.save();
    res.send(trip);

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
    trip.isCompleted = true;

    await trip.save();

    res.status(200).send(_.pick(trip, ["bus", "start", "end", "fare", "isPaid", "isCompleted"]));
});


router.post("/test", async (req, res) => {
    const trip = await Trip.findOne({ _id: req.body.tripID });
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
    trip.isCompleted = true;

    trip.save();

    res.status(200).send(x);
})


const getTripInfo = async (cords) => {
    const length = cords.length;
    const start = cords[0];
    const end = cords[length - 1];
    const result = await googleMaps.getDistance(start, end);
    const distance = result.distance.value;
    let price = process.env.MINIMUM_FARE;
    let additional_fare = process.env.ADDITIONAL_FARE;
    if (distance > 1000) {
        price += Math.floor(distance / 1000) * additional_fare
    }
    const tripSummary = {
        fare: {
            text: `${price} LKR`,
            value: price
        },
        trip: result
    }
    console.log(tripSummary);
    return tripSummary;
}

module.exports = router;
