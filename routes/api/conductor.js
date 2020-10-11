const express = require("express");
const Conductor = require("../../models/conductor");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const http = require('https');
const fs = require('fs');
const auth = require("../../middleware/auth");
const { log } = require("console");
const { response } = require("express");
const router = express.Router();

//validate conductor details before doing the certaing queries
function validateConductor(conductor) {
  const schema = {
    name: Joi.string().min(10).max(255).required().label("Name"),
    email: Joi.string().min(10).max(255).label("Email"),
    nic: Joi.string().min(8).required().label("NIC"),
    conductorNumber: Joi.string().required().label("Conductor NO"),
    address: Joi.string().min(10).max(255).required().label("Address"),
    contact: Joi.string().min(8).required().label("Contact"),
    password: Joi.string().min(8).required().label("password"),
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
    contact:req.body.contact,
    password:req.body.password
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

router.post('/getOne', async (req, res) => {
  try {
    let id = req.body.id;
    const conductor = await Conductor.findById(id);
    res.status(200).send(conductor);
  } catch (error) {
  res.status(400).send(error.message);
  }
});


router.post("/update", async (req, res) => { 
  let id = req.body.id;
  const conductor = await Conductor.findById(id).then()

  // if(!req.body.name==""){
  //     if(!(req.body.name==conductor.name)){
  //       conductor.name=req.body.name;
  //   }
  // }
  //console.log(conductor);
  const updateDoc = {
    name: req.body.name,
    email: req.body.email,
    nic: req.body.nic,
    conductorNumber: req.body.conductorNumber,
    address: req.body.address,
    contact:req.body.contact,
    password:req.body.password
  }
  console.log(updateDoc);
  Conductor.updateOne({_id:id},updateDoc).exec().then(data=>{
    if(data){
      res.status(200).json({"message":"success"});
    }
    
  }).catch(err => {
    console.log(err)
    res.status(400).json({"message":"failed"});
    
  })
  
});

router.post("/delete", async (req, res) => {
  let id = req.body.id;
  await Conductor.findByIdAndDelete(id)
      .then(conductors => {
        
          res.status(200).json({ 'conductors': 'conductors deleted successfully' });
      })
      .catch(err => {
          console.log("not deleted")
          res.status(400).send('deleting conductors failed');
      });
});

router.post("/conductor-profile", async (req, res) => {
  console.log(req.body)
  // try {
  // const bus = await Bus.findById(req.body.id);

  // res.status(200).send(bus);
  // } catch (error) {
  // res.status(400).send(error.message);
  // }
  console.log("router")
  Conductor.findById(req.body.id)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    console.log(err);
  });
res.status(200);
});

module.exports = router;
