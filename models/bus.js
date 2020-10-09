const mongoose = require("mongoose");

const busesSchema = new mongoose.Schema({

    busNo: {
        type: String,
        required: true,
        unique: true
    },
    busRoute: {
        type: String,
        required: true,
    },
    busCapacity: {
        type: String,
        required: true,
    },
    personals: {
        owner: {
            id: { type: String },
            name: { type: String },
            email: { type: String }
        },
        driver: {
            id: { type: String },
            name: { type: String }
        },
        conductor: {
            id: { type: String },
            name: { type: String }
        }
    }, 
    startPoint: {
        type: String,
        required:true,
    },
    endPoint: {
        type: String,
        required:true,
    },
    route: {
        forward: {
            start: {
                type: String,  
            },
            end: {
                type: String,
            },
            departuretime: {
                type: Date,
            }
        },
        backward: {
            start: {
                type: String,  
            },
            end: {
                type: String,
            },
            departuretime: {
                type: Date,
            }
        }
    }

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


const Bus = mongoose.model("Bus", busesSchema);

module.exports = Bus;
