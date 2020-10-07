const express = require("express");
const Conductor = require("../../models/conductor");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const http = require('https');
const fs = require('fs');
const auth = require("../../middleware/auth");
const { log } = require("console");
const router = express.Router();

function validateConductor(conductor) {
  const schema = {
    name: Joi.string().min(10).max(255).required().label("Name"),
    email: Joi.string().min(10).max(255).label("Email"),
    nic: Joi.string().min(8).required().label("NIC"),
    conductorNumber: Joi.string().required().label("Conductor NO"),
    address: Joi.string().min(10).max(255).required().label("Address"),
    contact: Joi.string().min(8).required().label("Contact"),
  };
  return Joi.validate(conductor, schema);
}

router.post("/register", async (req, res) => {
  console.log("Check");
  const { error } = validateConductor(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  console.log(req.body)
  conductor = new Conductor({
    name: req.body.name,
    email: req.body.email,
    nic: req.body.nic,
    conductorNumber: req.body.conductorNumber,
    address: req.body.address,
    contact:req.body.contact
  })

  
  conductor.save()
  .then(conductors => {
    res.status(200).json({'conductors': 'Added successfully'});
})
.catch(err => {
    res.status(400).send('Failed Adding Conductor');
});

});

router.get("/", async (req, res) => {
  try {
    const conductor = await Conductor.find();
    res.status(200).send(conductor);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/getOne', async (req, res) => {
  try {
    let id = req.body['_id'];
    const conductor = await Conductor.findById(id);
    res.status(200).send(conductor);
  } catch (error) {
  res.status(400).send(error.message);
  }
});


router.post("/update", async (req, res) => { 
  let id = req.body['_id'];
  Conductor.findById(id, function (err, conductorDetail) {
      if (!conductorDetail) {
          res.status(404).send('data is not found');

      } else 
      conductorDetail.name= req.body.name,

      conductorDetail.save().then(conductorDetail => {
              res.json('Conductor Details updated');
          })
              .catch(err => {
                  res.status(400).send("Update not possible");
              });
      
  });
});

router.post("/delete", async (req, res) => {
  let id = req.body['_id'];
  console.log(id);
  await Conductor.findByIdAndDelete(id)
      .then(conductors => {
          console.log(conductors)
          res.status(200).json({ 'conductors': 'conductors deleted successfully' });
      })
      .catch(err => {
          console.log("not deleted")
          res.status(400).send('deleting conductors failed');
      });
});


module.exports = router;
