const express = require("express");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const _ = require("lodash");
const axios = require('axios').default;
const qs = require('querystring');
const { chargeAPI, authAPI } = require('../../api/payhere');
const { request } = require("http");

const router = express.Router();

router.post("/methods", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const payMethods = _.pick(user, ['paymentMethods']);
        res.status(200).send(payMethods);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/set-primary-method", auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    const methodID = req.body.methodID;
    if (!methodID) return res.status(400).send("No payment method provided");
    const method = await user.setPrimaryPayMethod(methodID);
    return res.send(method);
});

router.post("/get-primary-method", auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    const method = user.getPrimaryPayMethod();
    if (method) return res.send(method);
    return res.status(404).send({ error: "Primary payment method not found" });
});

router.post("/charge", async (req, res) => {
    const order_id = "Trip12333";
    const items = "Bus fare #12333";
    const amount = 100.50;
    const customer_token = "C619B097321D780E660095A1A278FCFB";
    const req_body = {
        order_id, items, currency: "LKR", amount, customer_token
    }
    const result = await chargeAPI.post('', req_body);
    res.send(result.data);
});


module.exports = router;