const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const busSchema = new mongoose.Schema({
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
  address: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
  },
  authProvider: {
    type: String,
    default: "app"
  },
  password: {
    type: String,
    required: function () { return this.authProvider != "facebook" },
  },
  image: {
    type: String,
  },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


busSchema.methods.generateAuthToken = function () {
  const { _id, name, email, address,image } = this;
  const token = jwt.sign({
    id: _id,
    name,
    email,
    address,
    image
  }, process.env.JWT_PRIVATE_KEY);
  return token;
};

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
