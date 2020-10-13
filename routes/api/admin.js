const express = require("express");
const Conductor = require("../../models/conductor");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const User = require("../../models/User");

const router = express.Router();

// function validateConductor(conductor) {
//   const schema = {
//     name: Joi.string().min(10).max(255).required().label("Name"),
//     email: Joi.string().min(10).max(255).label("Email"),
//     nic: Joi.string().min(8).required().label("NIC"),
//     conductorNumber: Joi.string().required().label("Conductor NO"),
//     address: Joi.string().min(10).max(255).required().label("Address"),
//     contact: Joi.string().min(8).required().label("Contact"),
//   };
//   return Joi.validate(conductor, schema);
// }

// router.get("/owners", auth, admin, async (req, res) => {
router.get("/owners", async (req, res) => {
  try {
    const owners = await User.find({"userRole.isOwner":true});
    // if (!user.userRole.isConductor) return res.status(400).send({ error: "Invalid email address" });
    res.status(200).send(owners);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// router.get('/ownerdetails/:id',auth,admin, async (req, res) => {
router.get('/ownerdetails/:id', async (req, res) => {
  try {
    const owner = await User.findById(req.params.id);
    res.status(200).send(owner);
  } catch (error) {
  res.status(400).send(error.message);
  }
});

//router.post("/delete", auth, owner, async (req, res) => {
router.post("/delete", async (req, res) => {
    await User.deleteOne(req.body.id)
        .then(owner => {
            console.log(owner)
            res.status(200).json({ 'owners': 'User deleted successfully' });
        })
        .catch(err => {
            console.log("deleted")
            res.status(400).send('Deleting user failed');
        });
});

module.exports = router;
