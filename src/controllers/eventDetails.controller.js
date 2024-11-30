const express = require('express');
const router = express.Router();
const EventDetails = require('../models/eventDetails.model');
const Event = require('../models/event.model');

// Get all event details
router.get('/', async (req, res) => {
    try {
        const allEventDetails = await EventDetails.find(
            { is_active: '1', is_deleted: '0' }, // Filters
            { created_at: 0 } // Projection to exclude `created_at`
        ).select("-is_active -is_deleted -updated_at");
        
        res.status(200).send(allEventDetails);
    } catch (error) {
        console.error("Error fetching event details:", error);
        res.status(500).json({ message: "Error fetching event details.", error });
    }
});

// Create new event details
router.post("/create", async (req, res) => {
    try {
        // Log the incoming request body to inspect it
        console.log(req.body);

        // Validate the input fields
        const movie = await EventDetails.create(req.body);
        return res.status(200).json({ message: "EventDetails Added succesfully"});

    } catch (error) {
        // Handle errors if any
        console.error(error);
        res.status(500).send({ error: 'An error occurred while creating the booking' });
    }
});


// Get a single event detail by EventID, only if active and not deleted, 
router.get('/event/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const eventDetail = await EventDetails.find(
            { is_active: '1', is_deleted: '0',event_id :id }, // Filters
        ).select("-is_deleted -updated_at");

        // const events = await Event.find({ _id: id,
        //     is_active: '1',
        //     is_deleted: '0'
        // }).select("-is_active -is_deleted -updated_at"); 

        if (!eventDetail) {
            return res.status(404).json({ message: "Event details not found or inactive/deleted." });
        }

        // const Data = {
        //     eventDetail: eventDetail,
        //     events: events,
        // };

        res.status(200).send(eventDetail);

    } catch (error) {
        console.error("Error fetching event detail:", error);
        res.status(500).json({ message: "Error fetching event detail.", error });
    }
});


// Update event details
router.post('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { event_id, date, price, slots } = req.body;

        // Build the update object based on the provided fields
        const updateData = {};
        if (event_id) updateData.event_id = event_id;
        if (date) updateData.date = date;
        if (price) updateData.price = price;
        if (slots) updateData.slots = slots;

        const eventDetail = await EventDetails.findByIdAndUpdate(id, updateData, { new: true });
        if (!eventDetail) {
            return res.status(404).json({ message: "Event details not found." });
        }

        res.status(200).json({ message: "Event details updated successfully", eventDetail });
    } catch (error) {
        console.error("Error updating event details:", error);
        res.status(500).json({ message: "Error updating event details.", error });
    }
});

// Soft delete event details
router.post('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const eventDetail = await EventDetails.findByIdAndUpdate(
            id,
            { is_deleted: '1' },  // Mark as deleted
            { new: true }
        );

        if (!eventDetail) {
            return res.status(404).json({ message: "Event details not found." });
        }

        res.status(200).json({ message: "Event details soft deleted successfully.", eventDetail });
    } catch (error) {
        console.error("Error deleting event details:", error);
        res.status(500).json({ message: "Error deleting event details.", error });
    }
});

// Undo soft delete for event details
router.post('/undo-delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const eventDetail = await EventDetails.findByIdAndUpdate(
            id,
            { is_deleted: '0' },  // Restore
            { new: true }
        );

        if (!eventDetail) {
            return res.status(404).json({ message: "Event details not found." });
        }

        res.status(200).json({ message: "Event details restored successfully.", eventDetail });
    } catch (error) {
        console.error("Error restoring event details:", error);
        res.status(500).json({ message: "Error restoring event details.", error });
    }
});

module.exports = router;
