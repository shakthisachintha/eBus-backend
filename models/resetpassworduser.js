const mongoose = require("mongoose");

const resetUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  resetCode: {
    type: Number,
    minlength: 6,
  },
  requestUserID: {
    type: String,
    required: true
  },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


const ForgetPasswordUser = mongoose.model("ForgetPasswordUser", resetUserSchema);

module.exports = ForgetPasswordUser;
