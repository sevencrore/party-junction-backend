const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },  // Name of the vendor
    description: { type: String },  // Description of the vendor
    order :{type:Number},
    is_active: { type: String, default: '1' },  // '1' for active, '0' for inactive
    image: { type: String },  // URL for the category image
    is_deleted : {type : String,default : '0'},
}, {
    versionKey: false,
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

const City = mongoose.model("City", citySchema);

module.exports = City;
