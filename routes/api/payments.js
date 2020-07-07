const express = require("express");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const _ = require("lodash");

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

module.exports = router;