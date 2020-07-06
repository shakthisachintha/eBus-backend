const express = require("express");
const User = require("../models/User");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const http = require('https');
const fs = require('fs');
const auth = require("../middleware/auth");

const router = express.Router();

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).required().label("Name"),
    email: Joi.string().min(8).required().label("Email"),
    password: Joi.string().label('Password'),
    isAdmin: Joi.boolean(),
    isConductor: Joi.boolean(),
    image: Joi.string(),
    authProvider: Joi.string().allow("facebook")
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

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  if (req.body.isAdmin) user.userRole.isAdmin = true;
  if (req.body.isConductor) user.userRole.isConductor = true;

  try {
    const result = await user.save();
    const token = user.generateAuthToken();

    return res
      .header("x-auth-token", token).send(_.pick(result, ["id", "name", "email", "image", "userRole"]));
  } catch (error) {
    for (field in error.errors) {
      return res.status(400).send(error.errors[field].message);
    }
  }
});


router.post("/register/facebook", async (req, res) => {
  let user = await User.findOne({
    email: req.body.email,
  });

  // If the user already existing we send the auth token it can use to login the user
  if (user) {
    const token = await user.generateAuthToken();
    return res.status(200).header('x-auth-token', token).send();
  }

  // If the user doesnot exist we create,store and send the auth token
  user = new User(_.pick(req.body, ["name", "email", "authProvider"]));

  http.get(req.body.image, async function (response) {
    const user_id = user._id;
    const ext = response.headers["content-type"].split("/")[1];
    const location = "storage/public/profile/"
    const image = `${location}${user_id}.${ext}`;
    const file = await fs.createWriteStream(image);
    await response.pipe(file);

    const imageURI = `${process.env.BASE_URL}images/profile/${user_id}.${ext}`;
    user.image = imageURI;

    const result = await user.save();
    const token = user.generateAuthToken();

    return res
      .header("x-auth-token", token).send(_.pick(result, ["id", "name", "email", "image", "userRole"]));
  });

})

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
