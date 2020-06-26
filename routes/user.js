const express = require("express");
const User = require("../models/user");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

const router = express.Router();

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().min(8).required(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(user, schema);
}

router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.send(error.details[0].message).status(400);

  let user = await User.findOne({
    email: req.body.email,
  });
  if (user) return res.send("User already exist").status(200);

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    const result = await user.save();
    const token = user.generateAuthToken();

    return res
      .header("x-auth-token", token)
      .send(_.pick(result, ["id", "name", "email"]));
  } catch (error) {
    for (field in error.errors) {
      return res.send(error.errors[field].message).status(400);
    }
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const genres = await User.findById(req.user.id).select("-password");
    res.send(genres).status(200);
  } catch (error) {
    res.send(error.message).status(200);
  }
});

module.exports = router;
