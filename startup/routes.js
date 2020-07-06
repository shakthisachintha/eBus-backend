const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/user");
const paymentRoutes = require("../routes/payments");
const express = require("express");
const error = require("../middleware/error");


module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/api/user", userRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/payments", paymentRoutes);
    app.use(error);
    app.use("/images", express.static('storage/public'));
}