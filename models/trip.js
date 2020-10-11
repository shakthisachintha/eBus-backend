const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    passenger: { type: String, required: true },
    bus: {
        number: { type: String, required: true },
        driver: {
            name: { type: String, required: true },
            id: { type: String, required: true },
        },
        conductor: {
            name: { type: String, required: true },
            id: { type: String, required: true },
            telephone: { type: String }
        }
    },
    fare: {
        amount: { value: { type: Number, default: 12, required: true }, text: { type: String, default: "12 LKR" } },
        payment: {
            method: { type: String },
            timestamp: { type: String }
        }
    },
    isCompleted: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    start: {
        place_name: { type: String },
        formatted_address: { type: String },
        cordes: {
            lat: { type: String },
            lng: { type: String },
        },
        time: { type: String },
    },
    end: {
        place_name: { type: String },
        formatted_address: { type: String },
        cordes: {
            lat: { type: String },
            lng: { type: String },
        },
        time: { type: String },
    },
    distance: {
        distance: { type: Object },
        time: { type: Object }
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Trips = mongoose.model("Trips", tripSchema);

module.exports = Trips;
