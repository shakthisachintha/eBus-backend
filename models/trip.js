const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    passenger: { type: String, required: true },
    bus: { type: String, required: true },
    cordes: { type: Array, required: true },
    fare: {
        amount: { value: { type: Number, default: 12, required: true }, text: { type: String, default: "12 LKR" } },
        payment: {
            method: { type: String },
            timestamp: { type: String }
        }
    },
    isCompleted: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    start: { type: Object },
    end: { type: Object }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Trips = mongoose.model("Trips", tripSchema);

module.exports = Trips;
