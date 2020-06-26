const winston = require('winston')
const mongoose = require("mongoose");

module.exports = function () {
    return mongoose
        .connect("mongodb://localhost:27017/playground", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => winston.info("Conneted to mongoDB"));
}