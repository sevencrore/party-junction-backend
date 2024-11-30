const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Name of the vendor
    description: { type: String },  // Description of the vendor
    is_active: { type: String, default: '1' },  // '1' for active, '0' for inactive
    is_deleted : {type : String,default : '0'},
}, {
    versionKey: false,
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
