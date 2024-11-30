const mongoose = require('mongoose');
const env=require('dotenv').config();


const connect = async () => {
    try {
        const res = await mongoose.connect("mongodb://0.0.0.0:27017/bookmyshow");
            if(res)
            {
                console.log("Connection succesfully");
            } 
    } catch (error) {
        console.error("Failed to connect to the local MongoDB database:", error);
    }
};

module.exports=connect;
