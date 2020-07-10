const express = require("express");
const User = require("../../models/User");
const Joi = require("joi");
const _ = require("lodash");

const bcrypt = require("bcrypt");

const router = express.Router();

function validateUser(req) {
  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
  };
  return Joi.validate(req, schema);
}

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ error: "Invalid username or password" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({ error: "Invalid username or password" });

  const token = user.generateAuthToken();
  return res.header("x-auth-token", token).send(_.pick(user, ['name', 'email', 'id']));
});

router.post("/conductor/login", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  
  if (!user) return res.status(400).send({ error: "Invalid username or password" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({ error: "Invalid username or password" });

  if(!user.userRole.isConductor) return res.status(403).send({ error: "Access denied" });
  const token = user.generateAuthToken();
  return res.header("x-auth-token", token).send(_.pick(user, ['name', 'email', 'id']));
});

module.exports = router;
