const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    busId:{
        type: String,
        required: true,
    },    
    date: {
        type: String,
        required: true,
    },
    // seat: {
    //     type: Array,
    //     required: true,
    // },
    numOfSeats: {
        type: Number,
        required: true,
    },
    bookOwner: {
        type: String,
        required: true,
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
