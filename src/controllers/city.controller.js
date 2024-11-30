const express = require('express');
const getRoleByEmail =require('../middleware/AdminAuthMiddleware');
const router = express.Router();
const multer = require('multer');
const City = require('../models/city.model');
const path = require('path'); 


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fullPath = path.join(__dirname, '../../uploads/city/');  // Define the folder to store images
        cb(null, fullPath); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Rename file with timestamp
    }
});

const upload = multer({ storage });

router.get('/',async(req,res)=>{

    let allEvents = await City.find({});

    res.status(200).send(allEvents);
})
router.post("/create", upload.single("image"), async (req, res) => {
    const { name, description, order } = req.body;
    // Check if the image exists, if not set imgPath to null
    const imgPath = req.file ? `/uploads/city/${req.file.filename}` : null;

    console.log(imgPath); // Logs the image path (or null if no image was uploaded)

    const newCity = new City({
        name,          // 'name' field from the request body
        description,   // 'description' field from the request body
        order,         // 'order' field from the request body
        image: imgPath // Save the image path (or null if no image)
    });

    try {
        await newCity.save();
        return res.status(200).json({ message: "City Added Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error adding city", error: error.message });
    }
});

router.post("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract city ID from URL parameter
        const { name, description,is_active } = req.body; // Get the name and description from the request body

        // Validate that name is provided
        if (!name) {
            return res.status(400).json({ message: "City name is required." });
        }

        // Build the update object. Only include description if it's provided.
        const updateData = { name ,is_active};
        if (description) {
            updateData.description = description;
        }

        // Find the city by ID and update its name and description (if provided)
        const city = await City.findByIdAndUpdate(
            id,
            updateData, // Update only the fields provided
            { new: true } // Return the updated city
        );

        if (!city) {
            return res.status(404).json({ message: "City not found." });
        }

        res.status(200).json({ message: "City updated successfully.", city });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating city.", error });
    }
});



router.post("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract event ID from URL parameter

        // Find the city by ID and update the `is_deleted` field to '1'
        const city = await City.findByIdAndUpdate(
            id,
            { is_deleted: '1' }, // Soft delete: set is_deleted to '1'
            { new: true } // Return the updated city
        );

        if (!city) {
            return res.status(404).json({ message: "City not found." });
        }

        res.status(200).json({ message: "City soft deleted successfully.", city });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting city.", error });
    }
});

router.post("/undo-delete/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract the city ID from URL parameter

        // Find the city by ID and update the `is_deleted` field to '0' (undo delete)
        const city = await City.findByIdAndUpdate(
            id,
            { is_deleted: '0' }, // Undo the soft delete by setting is_deleted to '0'
            { new: true } // Return the updated city
        );

        if (!city) {
            return res.status(404).json({ message: "City not found." });
        }

        res.status(200).json({ message: "City restored successfully.", city });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error restoring city.", error });
    }
});


module.exports=router;