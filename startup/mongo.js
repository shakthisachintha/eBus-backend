const winston = require('winston')
const mongoose = require("mongoose");

module.exports = function () {
    return mongoose
        .connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => winston.info("Conneted to mongoDB"));
}