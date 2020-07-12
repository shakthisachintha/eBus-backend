const express = require("express");
const Bus = require("../../models/bus");
const Joi = require("joi");
const _ = require("lodash");
const mongoose = require('mongoose');
const auth = require("../../middleware/auth");
const { schema } = require("../../models/bus");

// let Bus = require("../../models/bus");
const router = express.Router();

function validateBus(bus) {
    const schema = {
        busNo: Joi.string().min(6).required().label("Bus Number"),
        busRoute: Joi.string().required().label("Bus Route"),
        busCapacity: Joi.number().max(2).required().label("Bus Capacity")
    };
    return Joi.validate(bus, schema);
}

router.route('/').get(function(req, res) {
    Bus.find(function(err, eBus) {
        if (err) {
            console.log(err);
        }else {
            res.json(ebus);
        }    
    });
});

router.route('/:id').get(function(req,res){
    let id = req.params.id;
    Bus.findById(id, function(err, busDetail) {
        res.json(busDetail)
    });
});

router.route('/register').post(function(req,res) {
    const { error } = validateBus(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    let buses = new Bus(req.body);
    buses.save()
        .then(buses => {
            res.status(200).json({'buses': 'buses added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new buses failed');
        });
});

router.route('/update/:id').post(function(req, res) {
    Bus.findById(req.params.id, function(err, busDetail) {
        if (!busDetail) {
            res.status(404).send('data is not found');

        } else {
            busDetail.busNo = req.body.busNo;
            busDetail.busRoute = req.body.busRoute;
            busDetail.busCapacity = req.body.busCapacity;
        
            busDetail.save().then(busDetail => {
                res.json('Bus Details updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
        }     
    });
});


module.exports = router;
