const express = require('express');
const getRoleByEmail =require('../middleware/AdminAuthMiddleware');
const router = express.Router();
const SlideImage = require('../models/slideImage.model');
const multer = require('multer');
const path = require('path'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fullPath = path.join(__dirname, '../../uploads/Slide_img/');  // Define the folder to store images
        cb(null, fullPath); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Rename file with timestamp
    }
});

const upload = multer({ storage });

router.get('/',async(req,res)=>{

    let allImages = await SlideImage.find({});

    res.status(200).send(allImages);
})

router.post("/create", upload.single("image"), async (req, res) => {
    console.log(req.body);
    const {name } = req.body;
    try {
        // Extract data and image path from the request
        const { description } = req.body;  
        const imagePath = `/uploads/Slide_img/${req.file.filename}`;  // Construct the URL path for the image
        console.log(imagePath);
        // Save the category with the image path
        const newImage = new SlideImage({
            name:name,  
            description,
            image: imagePath
        });

        await newImage.save();

        res.status(200).json({ message: 'Slide Image saved successfully!', sildeImage: newImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving Slide Image.', error });
    }
});


router.post("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract category ID from URL parameter
        const { name, description,is_active } = req.body; // Get the name and description from the request body

        const imagePath = req.files && req.files["image"] ? `uploads/Slide_img/${req.files["img"][0].filename}` : null;

        // Build the update object. Only include description if it's provided.
        const updateData = { name ,is_active};
        if (description) {
            updateData.description = description;
            updateData.image = imagePath;
        }

        // Find the category by ID and update its name and description (if provided)
        const slideImage = await SlideImage.findByIdAndUpdate(
            id,
            updateData, // Update only the fields provided
            { new: true } // Return the updated category
        );

        if (!category) {
            return res.status(404).json({ message: "iamge not found." });
        }

        res.status(200).json({ message: "slide Image updated successfully.", slideImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating Slide Image.", error });
    }
});


router.post("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract category ID from URL parameter

        // Find the category by ID and update the `is_deleted` field to '1'
        const SlideImage = await SlideImage.findByIdAndUpdate(
            id,
            { is_deleted: '1' }, // Soft delete: set is_deleted to '1'
            { new: true } // Return the updated SlideImage
        );

        if (!SlideImage) {
            return res.status(404).json({ message: "Slide Image not found." });
        }

        res.status(200).json({ message: "Slide Image soft deleted successfully.", SlideImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting SlideImage.", error });
    }
});

router.post("/undo-delete/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract the slide Image ID from URL parameter

        // Find the slide Image by ID and update the `is_deleted` field to '0' (undo delete)
        const SlideImage = await SlideImage.findByIdAndUpdate(
            id,
            { is_deleted: '0' }, // Undo the soft delete by setting is_deleted to '0'
            { new: true } // Return the updated SlideImage
        );

        if (!SlideImage) {
            return res.status(404).json({ message: "Category not found." });
        }

        res.status(200).json({ message: "Slide Image  restored successfully.", SlideImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error restoring SlideImage.", error });
    }
});


module.exports=router;