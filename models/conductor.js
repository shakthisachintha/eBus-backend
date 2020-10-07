const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const conductorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  nic: {
    type: String,
    required: true,
    minlength: 10
  },
  conductorNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    maxlength: 255,
  },
  contact: {
    type: String,
    required: true,
  },
  authProvider: {
    type: String,
    default: "app"
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

conductorSchema.methods.generateAuthToken = function () {
  const { _id, name, email, nic, conductorNumber, address, contact } = this;
  const token = jwt.sign({
    id: _id,
    name,
    email,
    nic,
    conductorNumber,
    address,
    contact
  }, process.env.JWT_PRIVATE_KEY);
  return token;
};

const Conductor = mongoose.model("Conductor", conductorSchema);

module.exports = Conductor;
