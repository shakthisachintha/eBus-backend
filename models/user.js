const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type:Boolean,
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id ,isAdmin:this.isAdmin}, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
