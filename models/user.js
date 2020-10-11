const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const Transaction = require("./transaction");
const payHere = require('../api/payhere');

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
    },
  },
  ownerMeta: {
    address: {
      type: String,
      required: function () { return this.userRole.isOwner }
    },
    nic: {
      type: String,
      required: function () { return this.userRole.isOwner }
    },
<<<<<<< HEAD
    // contactNo:{
    //   type:String,
    //   required: function(){return this.userRole.isOWner}
    // },      
=======
    contactNo: {
      type: String,
      required: function () { return this.userRole.isOWner }
    },
>>>>>>> e18ba25d2bee6c1b98ec50969539abd023d1fc64

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
  wallet: {
    prepaidBalance: { type: Number, default: 0 },
    debt: { type: Number, default: 0 },
    isPrimary: { type: Boolean, default: false }
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
  const { _id, userRole, name, email, image,phoneNumber,ownerMeta } = this;
  const token = jwt.sign({
    id: _id,
    isAdmin: userRole.isAdmin,
    isOwner: userRole.isOwner,
    name,
    email,
    image,
    phoneNumber,
    ownerMeta,
    
  }, process.env.JWT_PRIVATE_KEY);
  return token;
};

userSchema.methods.setPrimaryPayMethod = async function (methodID) {
  var methods = this.paymentMethods;
  this.wallet.isPrimary = false;
  methods.forEach(method => {
    if (method.isPrimary) {
      method.isPrimary = false;
      return
    }
  });

  if (methodID == "wallet") {
    this.wallet.isPrimary = true;
  } else {
    methods.forEach(method => {
      if (method._id == methodID) {
        method.isPrimary = true
      }
    });
  }

  this.paymentMethods = methods;
  await this.save();
  return await this.getPrimaryPayMethod();
}

userSchema.methods.chargeFromWallet = async function (item, amount, reason) {
  let transaction = {
    userId: this._id,
    amount: { value: amount, text: `${amount} LKR` },
    item,
    reason,
  }
  if (this.wallet.prepaidBalance >= amount) {
    this.wallet.prepaidBalance = this.wallet.prepaidBalance - amount;
    this.save();
    const meta = {
      method: "Wallet",
      description: "Charged from prepaid balance"
    };
    transaction = { ...transaction, status: "success", status_code: 2, meta }
  } else {
    this.wallet.prepaidBalance = 0
    this.wallet.debt = this.wallet.prepaidBalance - amount;
    this.save();
    const meta = {
      method: "Wallet",
      description: "Failed to charge from prepaid balance"
    };
    transaction = { ...transaction, status: "failed", status_code: -2, meta }
  }

  let transaction_record = new Transaction(transaction);
  transaction_record.save();
  return transaction;
}

userSchema.methods.chargeFromPrimaryMethod = async function (item, amount, reason) {
  let method = this.getPrimaryPayMethod();

  let transaction = {
    userId: this._id,
    amount: { value: amount, text: `${amount} LKR` },
    item,
    reason,
  }

  if (!method) method = { method: "wallet" };

  // Pay from prepaid wallet
  if (method.method == "wallet") {
    return this.chargeFromPrimaryMethod(item, amount, reason)
  }
  // Pay from saved card
  else {
    const payment = await payHere.charge({
      amount: amount,
      items: item,
      order_id: reason.id,
      customer_token: method.token
    });
    const meta = {
      method: method.method,
      cardDetails: method,
      description: payment.data.status_message,
      paymentID: payment.data.payment_id
    }
    if (payment.data.status_code == 2) {
      transaction = { ...transaction, status: "success", status_code: 2, meta }
    }
    else {
      transaction = { ...transaction, status: "failed", status_code: payment.data.status_code, meta }
    }
  }

  let transaction_record = new Transaction(transaction);
  transaction_record.save();
  return transaction;
}

userSchema.methods.getPrimaryPayMethod = function () {

  var methods = this.paymentMethods;
  var primaryMethod = null;

  if (this.wallet.isPrimary) {
    console.log({ method: "wallet", ...this.wallet });
    return { method: "wallet", ...this.wallet };
  }

  methods.forEach(method => {
    if (method.isPrimary) {
      primaryMethod = method;
      return
    }
  });

  return primaryMethod;
}
const User = mongoose.model("User", userSchema);

module.exports = User;
