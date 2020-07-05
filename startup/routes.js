const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/user");
const express = require("express");
const error = require("../middleware/error");


module.exports = function (app) {
    app.use(express.json());
    app.use("/api/user", userRoutes);
    app.use("/api/auth", authRoutes);
    app.use(error);
    app.use("/images", express.static('storage/public'));
}