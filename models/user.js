const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

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
    isOwner: {
      type: Boolean,
      default: false,
    },
    isConductor: {
      type: Boolean,
      default: false
    }
  },
  ownerMeta: {
    address: {
      type: String,
      required: function () { return this.userRole.isOwner }
    },
    nic: {
      type: String,
      required: function () { return this.userRole.isOwner }
    }
  },
  image: {
    type: String,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  busNo: {
    type: String,
  },
  paymentMethods: [{
    method: {
      type: String,
    },
    token: {
      type: String,
    },
    isPrimary: {
      type: Boolean,
      default: false
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
  const { _id, userRole, name, email, image } = this;
  const token = jwt.sign({
    id: _id,
    isAdmin: userRole.isAdmin,
    isOwner: userRole.isOwner,
    name,
    email,
    image
  }, process.env.JWT_PRIVATE_KEY);
  return token;
};

userSchema.methods.setPrimaryPayMethod = async function (methodID) {
  var methods = this.paymentMethods;

  methods.forEach(method => {
    if (method.isPrimary) {
      method.isPrimary = false;
      return
    }
  });

  methods.forEach(method => {
    if (method._id == methodID) {
      method.isPrimary = true
    }
  });

  this.paymentMethods = methods;
  await this.save();
  return await this.getPrimaryPayMethod();
}

userSchema.methods.getPrimaryPayMethod = function () {

  var methods = this.paymentMethods;
  var primaryMethod = null;

  methods.forEach(method => {
    if (method.isPrimary) {
      primaryMethod = _.pick(method, ['_id', 'method', 'cardDetails']);
      return
    }
  });

  return primaryMethod;
}
const User = mongoose.model("User", userSchema);

module.exports = User;
