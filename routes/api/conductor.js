const express = require("express");
const Conductor = require("../../models/conductor");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const http = require('https');
const fs = require('fs');
const auth = require("../../middleware/auth");

const router = express.Router();

function validateConductor(user) {
  const schema = {
    name: Joi.string().min(10).max(255).required().label("Name"),
    email: Joi.string().min(10).max(255).label("Email"),
    nic: Joi.string().min(8).required().label("NIC"),
    conductorNumber: Joi.string().required().label("Conductor NO"),
    address: Joi.string().min(10).max(255).required().label("Address"),
    contact: Joi.string().min(8).required().label("Contact"),
  };
  return Joi.validate(user, schema);
}

router.post("/register", async (req, res) => {
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
    console.log("test");
    res.status(200).json({'conductors': 'Added successfully'});
    console.log(res);
})
.catch(err => {
    res.status(400).send('Failed Adding Conductor');
});

});


module.exports = router;
