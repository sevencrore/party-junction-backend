// const mongoose = require('mongoose');
// const env=require('dotenv').config();


// const connect = async () => {
//     try {
//         const res = await mongoose.connect("mongodb://0.0.0.0:27017/bookmyshow");
//             if(res)
//             {
//                 console.log("Connection succesfully");
//             } 
//     } catch (error) {
//         console.error("Failed to connect to the local MongoDB database:", error);
//     }
// };

// module.exports=connect;
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection function
const connect = async () => {
    try {
        // Use the connection string from .env file or a fallback (for testing)
        const uri = process.env.MONGO_URI || "mongodb+srv://msenterpriseswebsite:oYc5JmxgvlHxpE1B@serverlessinstance0.1vg6kb2.mongodb.net/?retryWrites=true&w=majority&appName=ServerlessInstance0";

      // const uri ="mongodb://0.0.0.0:27017/bookmyshow"
        // Connect to MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Successfully connected to MongoDB Atlas");
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log("Collections in the database:", collections.map(c => c.name));
    } catch (error) {
        console.error("Failed to connect to MongoDB Atlas:", error);
    }
};

module.exports = connect;
