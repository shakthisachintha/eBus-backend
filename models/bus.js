const mongoose = require("mongoose");

const busesSchema = new mongoose.Schema({

    busNo: {
        type: String,
        required: true,
        unique: true
    },
    routeNo: {
        type: String,
        required: true,
    },
    startPoint: {
        type: String,
        required: true,
    },
    endPoint: {
        type: String,
        required: true,
    },
    busCapacity: {
        type: Number,
        required: true,
    },
    isReserveEnable: {
        type: Boolean,
        default: false,
        //required: true,
    },
    reserveRoute: {
        forward: {
            forwardStartPoint: { type: String },
            forwardDepartTime: { type: String }  
        },
        backward: {
            backwardStartPoint: { type: String },
            backwardDepartTime: { type: String }  
        },
    },
    noOfReservations: {
        type: Number,
        //required:true,
    },
    personals: {
        owner: {
            id: { type: String }, 
            name: { type: String },
            email: { type: String }
        },
        driver: {
            id: { type: String },
            name: { type: String },
            telephone: { type: String }
        },
        conductor: {
            id: { type: String },
            name: { type: String },
            telephone: { type: String }
        }
    }, 

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


const Bus = mongoose.model("Bus", busesSchema);

module.exports = Bus;
