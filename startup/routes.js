const authRoutes = require("../routes/api/auth");
const userRoutes = require("../routes/api/user");
// const webUserRoutes = require("../routes/api/webUser");
const paymentRoutes = require("../routes/payments");
const apiPayementRoutes = require("../routes/api/payments");
const conductorRoutes = require("../routes/api/conductor")
const express = require("express");
const error = require("../middleware/error");


module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/api/user", userRoutes);
    // app.use("/api/webUser", webUserRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/payment", apiPayementRoutes);
    app.use("/api/conductor", conductorRoutes);

    app.use("/payments", paymentRoutes);
    app.use(error);
    app.use("/images", express.static('storage/public'));
}