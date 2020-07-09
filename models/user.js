const mongoose = require("mongoose");
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
  authProvider: {
    type: String,
    default: "app"
  },
  password: {
    type: String,
    required: function () { return this.authProvider != "facebook" },
  },
  userRole: {
    isAdmin: {
      type: Boolean,
      default: false
    },
    isConductor: {
      type: Boolean,
      default: false
    }
  },
  image: {
    type: String,
  },
  address: {
    type: String,
  },
  number: {
    type: String,
  },
  paymentMethods: [{
    method: {
      type: String,
    },
    token: {
      type: String,
    },
    cardDetails: {
      holderName: {
        type: String
      },
      cardMask: {
        type: String
      },
    }
  }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

userSchema.pre('save', function (next) {
  let { isAdmin, isConductor } = this.userRole;
  if (this.image) return next();
  if (isAdmin) this.image = "https://www.kindpng.com/picc/m/368-3685978_admin-icon-gray-hd-png-download.png";
  if (isConductor) this.image = "https://cdn0.iconfinder.com/data/icons/transport-111/66/20-512.png";
  if (!isAdmin && !isConductor) this.image = "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png";
  return next();
});

userSchema.methods.generateAuthToken = function () {
  const { _id, userRole, name, email, image, address, number } = this;
  const token = jwt.sign({
    id: _id,
    isAdmin: userRole.isAdmin,
    name,
    email,
    image
  }, process.env.JWT_PRIVATE_KEY);
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
