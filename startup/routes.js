const authRoutes = require("../routes/api/auth");
const userRoutes = require("../routes/api/user");
const paymentRoutes = require("../routes/payments");
const apiPayementRoutes = require("../routes/api/payments");
const BusRoutes = require("../routes/api/bus")
const express = require("express");
const error = require("../middleware/error");


module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/api/user", userRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/payment", apiPayementRoutes);
    app.use("/api/bus", BusRoutes);

    app.use("/payments", paymentRoutes);
    app.use(error);
    app.use("/images", express.static('storage/public'));
}
