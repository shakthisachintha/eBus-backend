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

router.post("/forgetpassword", async (req, res) => {
  // let userEmail = await User.findOne({ email: req.body.email });
  // if (!userEmail) return res.status(400).send({ error: "Invalid email address" });
  // const code = Math.floor(100000 + Math.random() * 900000);
  // console.log(code);
  // const user = await User.findOneAndUpdate({ email: req.body.email }, {
  //   resetCode: code
  // }).then(()=>{
  //   res.status(200).send("Reset Code Sent");
  // }) 
  try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).send({ error: "Invalid email address" });
      const code = Math.floor(100000 + Math.random() * 900000);
      user.resetCode = code;
      const result = await user.save();
      if (!result) return res.status(400).send({ error: "Something went wrong!" });
      res.status(200).send("Reset Code Sent");
  } 
  catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/forgetpassword/verify", async (req, res) => {
  try {
      let resetReq = await User.findOne({ resetCode: req.body.code });
      if (!resetReq) return res.status(400).send({ error: "Invalid Code!!!" });
      resetReq.resetCode = null;
      const result = await resetReq.save();
      if (!result) return res.status(400).send({ error: "Something went wrong!" });
      res.status(200).send(result);
  } 
  catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
