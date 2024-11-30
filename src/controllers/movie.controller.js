const express = require('express');
const Movie = require('../models/movie.model');
const router = express.Router();
const getRoleByEmail =require('../middleware/AdminAuthMiddleware');

router.get("/",async (req,res)=>{
    const allMovies = await Movie.find({});
    res.status(200).send(allMovies);

})

router.get("/shikha",async (req,res)=>{
    
   console.log("Show")

})

router.post("/create",getRoleByEmail,async(req,res)=>{

    const movie = await Movie.create(req.body);
    return res.status(200).json({ message: "Movie Added succesfully"});
});

router.get("/:id",async(req,res)=>{
    const movie = await Movie.findById(req.params.id).lean().exec();
    return res.status(200).send([movie])
})
router.patch("/:id/update",async(req,res)=>{
    const movie = await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true});
    return res.status(200).send(movie)
})

module.exports=router;