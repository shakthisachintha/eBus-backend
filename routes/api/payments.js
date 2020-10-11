const express = require("express");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const _ = require("lodash");
const { chargeAPI, authAPI } = require('../../api/payhere');


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
    if (method) return res.send(_.pick(method, ['_id', 'method', 'cardDetails']));
    return res.status(404).send({ error: "Primary payment method not found" });
});

router.get("/wallet", auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) return res.send(user.wallet);
    return res.status(404).send({ error: "User not found" });
});

router.post("/wallet-recharge", auth, async (req, res) => {

    const user = await User.findById(req.user.id);
    const reason = {
        description: "Wallet Recharge",
        id: `${req.user.id}`
    }

    const transaction = await user.chargeFromPrimaryMethod("Wallet Recharge", req.body.amount, reason);

    if (transaction.status_code == 2) {

        let { prepaidBalance, debt } = user.wallet;

        // If user has debts it will be recovered here
        if (debt > 0) {
            if (transaction.amount.value + prepaidBalance >= debt) {
                prepaidBalance = prepaidBalance + transaction.amount.value - debt;
                debt = 0;
            }
            else {
                prepaidBalance = 0;
                debt = debt - (transaction.amount.value + transaction.amount.value);
            }
        }
        // If there is no debts we will add the whole amount to the balance
        else {
            debt = 0;
            prepaidBalance = prepaidBalance + transaction.amount.value;
        }

        user.wallet.prepaidBalance = prepaidBalance;
        user.wallet.debt = debt;
        user.save();
        return res.status(200).send({ message: "Recharge successfull", wallet: user.wallet });
    }
    return res.status(400).send({ message: "Recharge failed" });
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