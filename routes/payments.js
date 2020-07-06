const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

router.get('/payhere/return', function (req, res) {
    res.render('payhere/return');
});

router.get('/payhere/cancel', function (req, res) {
    res.render('payhere/cancel');
});

router.post('/payhere/notify', function (req, res) {
    console.log(req.body);
    res.status(200).send(req.body);
});

module.exports = router;