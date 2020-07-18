const express = require("express");
const User = require("../../models/User");
const ForgetPasswordUser = require("../../models/resetpassworduser")
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

function validatePassword(user) {
  const schema = {
    newpassword: Joi.string().required().min(6).label('New password'),
    confirmpassword: Joi.string().required().valid(Joi.ref('newpassword'))
  };
  return Joi.validate(user, schema);
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
      let userExist = await ForgetPasswordUser.findOne({ email: req.body.email });
      if(userExist){
        userExist.resetCode = code;
        result = await userExist.save();
      }else{
        forgetPasswordUser = new ForgetPasswordUser({ email: req.body.email, resetCode: code, requestUserID: user._id});
        result = await forgetPasswordUser.save();
      }
      if (!result) return res.status(400).send({ error: "Something went wrong!" });
      res.status(200).send(result);
  } 
  catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/conductor/forgetpassword", async (req, res) => { 
  try {
      let user = await User.findOne({ email: req.body.email });
      if(!user.userRole.isConductor) return res.status(400).send({ error: "Invalid email address" });
      const code = Math.floor(100000 + Math.random() * 900000);
      let userExist = await ForgetPasswordUser.findOne({ email: req.body.email });
      if(userExist){
        userExist.resetCode = code;
        result = await userExist.save();
      }else{
        forgetPasswordUser = new ForgetPasswordUser({ email: req.body.email, resetCode: code, requestUserID: user._id});
        result = await forgetPasswordUser.save();
      }
      if (!result) return res.status(400).send({ error: "Something went wrong!" });
      res.status(200).send(result);
  } 
  catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/forgetpassword/verify", async (req, res) => {
  try {
      let reqUser = await ForgetPasswordUser.findOne({ email: req.body.email });
      if (!reqUser) return res.status(401).send({ error: "Invalid user!!!" });
      if(req.body.code!=reqUser.resetCode) return res.status(400).send({ error: "Invalid Verification Code!!!" });
      reqUser.resetCode = null;
      const result = await reqUser.save();
      if (!result) return res.status(400).send({ error: "Something went wrong!" });
      res.status(200).send(result);
  } 
  catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/resetpassword", async (req, res) => {
  try {
      let reqUser = await ForgetPasswordUser.findOne({ _id: req.body.id });
      if (!reqUser) return res.status(401).send({ error: "Invalid!!!" });
      let user = await User.findOne({ _id: reqUser.requestUserID });
      userpasswords={newpassword:req.body.newpassword, confirmpassword:req.body.confirmpassword}
      const { error } = validatePassword(userpasswords);
      if (error) return res.status(400).send(error.details[0].message);
      let salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newpassword, salt);
      const result = await user.save();
      if (!result) return res.status(400).send({ error: "Something went wrong!" });
      let deleterequest = await ForgetPasswordUser.findOneAndRemove({ _id: reqUser.id });
      if (!deleterequest) return res.status(400).send({ error: "Something went wrong!" });
      res.status(200).send("Password Changed");
  } 
  catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
