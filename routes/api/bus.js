const express = require("express");
const Bus = require("../../models/bus");
const _ = require("lodash");
const Joi = require("joi");
const owner = require("../../middleware/owner")
const auth = require("../../middleware/auth")

const router = express.Router();

function validateBus(bus) {
    const schema = {
        busNo: Joi.string().min(6).required().label("Bus Number"),
        busRoute: Joi.string().required().label("Bus Route"),
        busCapacity: Joi.number().max(65).required().label("Bus Capacity")
    };
    return Joi.validate(bus, schema);
}

// router.get("/", auth, owner, async (req, res) => {
router.get("/", async (req, res) => {
    try {
        const bus = await Bus.find();
        res.status(200).send(bus);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/:id", auth, owner, async (req, res) => {
    try {
        console.log(req.params.id)
        const bus = await Bus.findById(req.body.id); // req.params.id
        // const user = Bus.find(personals.owner.id:req.params.id);
        res.status(200).send(bus);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/bus-profile", async (req, res) => {
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


// router.post("/register", auth, owner, async (req, res) => {
router.post("/register", async (req, res) => {
    const { error } = validateBus(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    let bus = new Bus();
    bus.busNo = req.body.busNo.toUpperCase();
    bus.busRoute = req.body.busRoute;
    // bus.startPoint=req.body.startPoint.toUpperCase();
    // bus.endPoint=req.body.endPoint.toUpperCase();
    bus.busCapacity = req.body.busCapacity;
    // bus.personals.owner = _.pick(req.user, ["name", "email", "id"]);
    // bus.route.forward.start = req.body.start.toUpperCase();
    // bus.route.forward.departureTime = req.body.startDepartureTime;
    // bus.route.backward.start = req.body.end.toUpperCase();
    // bus.route.backward.departureTime = req.body.endDepartureTime;
    try {
        await bus.save()
        res.status(200).send(bus);
    } catch (error) {
        if (error.code === 11000)
            res.status(403).send({ error: "Bus already exists" });
    }
});


router.post("/update", auth, owner, async (req, res) => {
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

router.post("/delete", auth, owner, async (req, res) => {
    await Bus.deleteOne(req.body.id)
        .then(buses => {
            console.log(buses)
            res.status(200).json({ 'buses': 'bus deleted successfully' });
        })
        .catch(err => {
            console.log("deleted")
            res.status(400).send('Deleting bus failed');
        });
});




module.exports = router;
