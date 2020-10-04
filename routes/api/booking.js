const express = require("express");
const Bus = require("../../models/bus");
const Booking = require("../../models/booking");

const Joi = require("joi");
const _ = require("lodash");
const mongoose = require('mongoose');
const auth = require("../../middleware/auth");


const router = express.Router();

router.get("/findBus/:start/:end", async (req, res) => {
    try {
    console.log(req.params);
    const bus = await Bus.find({startPoint:req.params.start,endPoint:req.params.end});
    console.log(bus)
    res.send(bus);
            
    } catch (error) {
      res.status(400).send(error.message);
    }
});

module.exports = router;