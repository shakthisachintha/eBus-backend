const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const busesSchema = new mongoose.Schema({
    
    busNo: {
        type: String,
        required: true,
    },
    busRoute: {
        type: String,
        required: true,
    },
    busCapacity: {
        type: String,
        required: true,
    },    

  }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


const Bus = mongoose.model("Bus", busesSchema);

module.exports = Bus;
