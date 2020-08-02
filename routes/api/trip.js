const express = require("express");
const auth = require("../../middleware/auth");
const Trip = require("../../models/trip");
const Joi = require("joi");
const _ = require("lodash");
const googleMaps = require('../../api/maps');

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
    const trip = await Trip.findOne({ _id: req.body.tripID, passenger: req.user.id });
    if (!trip) res.status(404).send({ error: "Trip object not found" });
    trip.cordes.push(req.body.location);
    trip.save();
    res.status(200).send();
});

router.post("/end", auth, async (req, res) => {
    const trip = await Trip.findOne({ _id: req.body.tripID, passenger: req.user.id });
    if (!trip) res.status(404).send({ error: "Trip object not found" });
    trip.cordes.push(req.body.location);
    const end_location = await googleMaps.getAddress(req.body.location.lat, req.body.location.lng);
    trip.end = end_location;
    trip.save();
    res.status(200).send();
});



module.exports = router;
