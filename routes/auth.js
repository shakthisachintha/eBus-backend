const express = require("express");
const User = require("../models/user");
const Joi = require("joi");
const _ = require("lodash");

const bcrypt = require("bcrypt");

const router = express.Router();

function validateUser(req) {
  const schema = {
    email: Joi.string().min(8).required(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(req, schema);
}

router.post("/login", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid username or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid username or password");

  const token = user.generateAuthToken();
  return res.header("x-auth-token", token).send(_.pick(user,['name','email','id']));
});

module.exports = router;
