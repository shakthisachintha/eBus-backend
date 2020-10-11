const express = require("express");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const _ = require("lodash");
const routes = require("../../startup/routes");
const axios = require('axios').default;


const router = express.Router();

router.post("/create-pdf",async(req,res)=>{

})

module.exports = router;