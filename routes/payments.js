const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.get('/payhere/return', function (req, res) {
    res.render('payhere/return');
});

router.get('/payhere/cancel', function (req, res) {
    res.render('payhere/cancel');
});

router.post('/payhere/notify', async function (req, res) {
    let user = await User.findOne({
        _id: req.body.custom_1,
    });
    let cardDetails = null;
    if (req.body.method === "VISA" || req.body.method === "MASTER" || req.body.method === "TEST") {
        cardDetails = {
            holderName: req.body.card_holder_name,
            cardMask: req.body.card_no,
        }
        console.log(cardDetails);
    }

    const paymentMethod = {
        method: req.body.method,
        token: req.body.customer_token,
        cardDetails: cardDetails
    }
    user.paymentMethods.push(paymentMethod);
    const result = await user.save();
    res.status(200).send({ body: req.body, user: result });
});

module.exports = router;