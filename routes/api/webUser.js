const express = require("express");
const User = require("../../models/WebUser");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const http = require('https');
const fs = require('fs');
const auth = require("../../middleware/auth");

const router = express.Router();

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).required().label("Name"),
    email: Joi.string().min(8).required().label("Email"),
  };
  return Joi.validate(user, schema);
}

router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  let user = await User.findOne({
    email: req.body.email,
  });

  if (user) return res.status(403).send({ error: "User already exist!" });

  user = new User(_.pick(req.body, ["name", "email"]));
  let salt = await bcrypt.genSalt(10);

  try {
    const result = await user.save();
    const token = user.generateAuthToken();

    return res
      .header("x-auth-token", token).send(_.pick(result, ["id", "name", "email"]));
  } catch (error) {
    for (field in error.errors) {
      return res.status(400).send(error.errors[field].message);
    }
  }
});



module.exports = router;
