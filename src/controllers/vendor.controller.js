const express = require('express');
const getRoleByEmail =require('../middleware/AdminAuthMiddleware');
const router = express.Router();
const Vendor = require('../models/vendor.model');



router.get('/',async(req,res)=>{

    let allEvents = await Vendor.find({});

    res.status(200).send(allEvents);
})

router.post("/create",async(req,res)=>{

    const movie = await Vendor.create(req.body);
    return res.status(200).json({ message: "Vendor Added succesfully"});
});

router.post("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract vendor ID from URL parameter
        const { name, description ,is_active} = req.body; // Get the name and description from the request body

        // Validate that name is provided
        if (!name) {
            return res.status(400).json({ message: "Vendor name is required." });
        }

        // Build the update object. Only include description if it's provided.
        const updateData = { name ,is_active};
        if (description) {
            updateData.description = description;
        }

        // Find the vendor by ID and update its name and description (if provided)
        const vendor = await Vendor.findByIdAndUpdate(
            id,
            updateData, // Update only the fields provided
            { new: true } // Return the updated vendor
        );

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        res.status(200).json({ message: "Vendor updated successfully.", vendor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating vendor.", error });
    }
});


router.post("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract event ID from URL parameter

        // Find the vendor by ID and update the `is_deleted` field to '1'
        const vendor = await Vendor.findByIdAndUpdate(
            id,
            { is_deleted: '1' }, // Soft delete: set is_deleted to '1'
            { new: true } // Return the updated vendor
        );

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        res.status(200).json({ message: "Vendor soft deleted successfully.", vendor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting vendor.", error });
    }
});

router.post("/undo-delete/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract the vendor ID from URL parameter

        // Find the vendor by ID and update the `is_deleted` field to '0' (undo delete)
        const vendor = await Vendor.findByIdAndUpdate(
            id,
            { is_deleted: '0' }, // Undo the soft delete by setting is_deleted to '0'
            { new: true } // Return the updated vendor
        );

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        res.status(200).json({ message: "Vendor restored successfully.", vendor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error restoring vendor.", error });
    }
});



module.exports=router;