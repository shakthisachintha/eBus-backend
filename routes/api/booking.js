const express = require("express");
const Bus = require("../../models/bus");
const Booking = require("../../models/booking");

const Joi = require("joi");
const _ = require("lodash");
const mongoose = require('mongoose');
const auth = require("../../middleware/auth");


const router = express.Router();

router.post("/findBus", auth, async (req, res) => {
    try {
        const bus = await Bus.find({startPoint:req.body.begining.toUpperCase(),endPoint:req.body.destination.toUpperCase()});
        // console.log(bus);
        res.send(bus); 
        } catch (error) {
        res.status(400).send(error.message);
        }
});

router.get("/findBusById/:busId", auth, async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.busId);
        console.log(bus);
        res.send(bus); 
        } catch (error) {
        res.status(400).send(error.message);
        }
});

router.get("/getBusSeat/:busId/:date", auth, async (req, res) => {
    try {
        console.log(req.params);
        const bus = await Booking.find({busId:req.params.busId,date:req.params.date});
        console.log(bus);
        console.log(bus.length);
    //     if(bus.length==0){
    //         const newBook=new Booking();
    //         newBook.busId=req.params.busId;
    //         newBook.date=req.params.date;
    //         const temp = await Bus.findById(req.params.busId);
    //         console.log(temp)
    //         let seat=[];
    //         // let now =new Date();
    //         // let today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    //         // today.getTime();
    //         for(let i=0;i<parseInt(temp.busCapacity);i++){
    //             seat.push(false);
    //         }

    //         newBook.seat=seat;
    
    //         newBook.save().then(data=>{
    //             res.send(data);
    //         }).catch(err=>{
    //             console.log(err)
    //         });
    //   }else{
    //     res.send(bus)
    //   }
      res.status(200).send(bus);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.get("/bookSeat/:busId/:date/:numOfSeats", auth, async (req, res) => {
    try {
        // console.log(req.params);
        booking = new Booking({ busId: req.params.busId, date: req.params.date, numOfSeats: req.params.numOfSeats, bookOwner:req.user.id });
        console.log(booking);
        result = await booking.save();
        if (!result) return res.status(400).send({ error: "Something went wrong!" });
        res.status(200).send(result);

        // const bus = await Booking.find({busId:req.params.busId,date:req.params.date});

        // bus[0].seat[req.params.seat]=true;
        
        // const temp = await Booking.updateOne({_id:bus[0]._id},{seat:bus[0].seat});
        // console.log(temp)
        // let seat=[];
        // // let now =new Date();
        // // let today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
        // // today.getTime();
        // res.send(temp);
        //   res.status(200).send("bus");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/viewreservations/:userId", auth, async (req, res) => {
    try {
        const bookings = await Booking.find({bookOwner:req.params.userId});
        console.log(bookings);
        res.send(bookings); 
        } catch (error) {
        res.status(400).send(error.message);
        }
});

module.exports = router;