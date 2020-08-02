const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    passenger: { type: String, required: true },
    bus: { type: String, required: true },
    cordes: { type: Array, required: true },
    fare: {
        amount: { type: Number, default: 12.50, required: true },
        payment: {
            method: { type: String },
            timestamp: { type: String }
        }
    },
    start: { type: Object },
    end: { type: Object }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Trips = mongoose.model("Trips", tripSchema);

module.exports = Trips;
