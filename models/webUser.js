const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const webUserSchema = new mongoose.Schema({
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
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

webUserSchema.methods.generateAuthToken = function () {
    const { _id, name, email } = this;
    const token = jwt.sign({
      id: _id,
      name,
      email,
    }, process.env.JWT_PRIVATE_KEY);
    return token;
  };
  
  const WebUser = mongoose.model("webUser", webUserSchema);
  
  module.exports = WebUser;