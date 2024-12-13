const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    email: { type: String, required: true }, // Email of the user
    name: { type: String }, // Name of the person making the booking
    user: { type: String }, // User's email or ID (event-specific user)
    number_of_members: { type: Number, required: true }, // Number of members for the booking
    eventDetailsID: { type: mongoose.Schema.Types.ObjectId, ref: 'EventDetails', required: true }, // Event Details ID linked to the booking
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // Event ID for specific event
    uid: { type: String, required: true, ref: 'User' }, // User's unique identifier
    displayName: { type: String, required: true }, // Display name of the user
    price: { type: Number, required: true }, // Total price for the booking

    // Additional Fields
    event_name: { type: String, required: true }, // Name of the event
    event_location: { type: String, required: true }, // Location of the event
    date: { type: Date, required: true }, // Date and time of the event
    price_per_head: { type: Number, required: true }, // Price per head for the event
    slot: { type: String, required: true }, // Available slots for the event
    city_name: { type: String, required: true }, // Available slots for the event
    payment: {
        type: String,
        default: 'NOT_DONE',
    },

}, {
    versionKey: false, // Disable the version key (_v)
    timestamps: true, // Enable automatic creation of createdAt and updatedAt fields
});

const Book = mongoose.model("booking", bookSchema);
module.exports = Book;
