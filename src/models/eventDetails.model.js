const mongoose = require('mongoose');

const eventDetailsSchema = new mongoose.Schema({
    event_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: true 
    },  // Foreign key referencing Event model
    date: { 
        type: Date, 
        required: true 
    },  // Date and time of the event
    price: { 
        type: Number, 
        required: true 
    },  // Array of price options
    slots: { 
        type: String, 
        required: true 
    },  // Array of slots available for the event
    is_active: { type: String, default: '1' },  // '1' for active, '0' for inactive
    is_deleted : {type : String,default : '0'},
}, {
    versionKey: false,
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

const EventDetails = mongoose.model("EventDetails", eventDetailsSchema);

module.exports = EventDetails;
