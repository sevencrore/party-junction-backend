const mongoose = require('mongoose');

const eventCategorySchema = new mongoose.Schema({
    category_name: { type: String, required: true },  // Category name for the event
    description: { type: String },  // Description of the category
    image: { type: String },  // URL for the category image
    is_active: { type: String, default: '1' },  // '1' for active, '0' for inactive
    is_deleted : {type : String,default : '0'},
}, {
    versionKey: false,
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

const EventCategory = mongoose.model("EventCategory", eventCategorySchema);

module.exports = EventCategory;
