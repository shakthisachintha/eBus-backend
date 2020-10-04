const express = require("express");
const Bus = require("../../models/bus");
const Booking = require("../../models/booking");

const Joi = require("joi");
const _ = require("lodash");
const mongoose = require('mongoose');
const auth = require("../../middleware/auth");


const router = express.Router();

router.get("/findBus/:start/:end", async (req, res) => {
    try {
    console.log(req.params);
    const bus = await Bus.find({startPoint:req.params.start,endPoint:req.params.end});
    console.log(bus)
    res.send(bus);
            
    } catch (error) {
      res.status(400).send(error.message);
    }
});

router.get("/getBusSeat/:busId/:date", async (req, res) => {
    try {
    console.log(req.params);
      const bus = await Booking.find({busId:req.params.busId,date:req.params.date});
      console.log(bus)
      if(bus.length==0){
            const newBook=new Booking();
            newBook.busId=req.params.busId;
            newBook.date=req.params.date;
            const temp = await Bus.findById(req.params.busId);
            console.log(temp)
            let seat=[];
            // let now =new Date();
            // let today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
            // today.getTime();
            for(let i=0;i<parseInt(temp.busCapacity);i++){
                seat.push(false);
            }

            newBook.seat=seat;
    
            newBook.save().then(data=>{
                res.send(data);
            }).catch(err=>{
                console.log(err)
            });
      }else{
          res.send(bus)
      }
    //   res.status(200).send("bus");
    } catch (error) {
      res.status(400).send(error.message);
    }
});

module.exports = router;