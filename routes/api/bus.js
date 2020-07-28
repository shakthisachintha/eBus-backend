const express = require("express");
const Bus = require("../../models/bus");
const Joi = require("joi");
const _ = require("lodash");
const mongoose = require('mongoose');
const auth = require("../../middleware/auth");


const router = express.Router();

function validateBus(bus) {
    const schema = {
        busNo: Joi.string().min(6).required().label("Bus Number"),
        busRoute: Joi.string().required().label("Bus Route"),
        busCapacity: Joi.number().max(50).required().label("Bus Capacity")
    };
    return Joi.validate(bus, schema);
}

// router.route('/view').get(function (req, res) {
//     // Bus.find(function (err, eBus) {
//     //     if (err) {
//     //         console.log(err);
//     //     } else {
//     //         res.json(ebus);
//     //     }
//     // });
//     buses = await Bus.find().pretty();
//     res.send(buses);
// });

router.get("/", async (req, res) => {
    try {
      const bus = await Bus.find();
      res.status(200).send(bus);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

//   router.route('/:id').get(function (req, res) {
//     let id = req.params.id;
//     Bus.findById(id, function (err, busDetail) {
//         res.json(busDetail)
//     });
// });

router.get("/:id", async (req, res) => {
    try {
        console.log(req.params.id)
    const bus = await Bus.findById(req.body.id);
    res.status(200).send(bus);
    } catch (error) {
    res.status(400).send(error.message);
    }
});

router.post("/bus-profile", async (req, res) => {
    // try {
    // const bus = await Bus.findById(req.body.id);

    // res.status(200).send(bus);
    // } catch (error) {
    // res.status(400).send(error.message);
    // }
    console.log("router")
    Bus.findById(req.body.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200);
});

// router.route('/register').post(function (req, res) {
router.post("/register", async (req, res) => {
    const { error } = validateBus(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    let buses = new Bus(req.body);
    buses.save()
        .then(buses => {
            res.status(200).json({ 'buses': 'buses added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new buses failed');
        });
});

// router.route('/update/:id').post(function (req, res) {
// router.post("/update/:id", async (req, res) => { 
router.post("/update", async (req, res) => { 
    Bus.findById(req.body.id, function (err, busDetail) {
        if (!busDetail) {
            res.status(404).send('data is not found');

        } else 
            busDetail.busNo = req.body.busNo;
            busDetail.busRoute = req.body.busRoute;
            busDetail.busCapacity = req.body.busCapacity;

            busDetail.save().then(busDetail => {
                res.json('Bus Details updated');
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
        
    });
});

router.post("/delete", async (req, res) => {
    await Bus.deleteOne(req.body.id)
        .then(buses => {
            console.log(buses)
            res.status(200).json({ 'buses': 'bus deleted successfully' });
        })
        .catch(err => {
            console.log("deleted")
            res.status(400).send('deleting bus failed');
        });
});


module.exports = router;
