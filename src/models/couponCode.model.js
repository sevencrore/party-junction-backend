const mongoose = require('mongoose');

const couponCodeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },  // Name of the coupon
    discount: { type: Number, required: true, min: 0 }  // Discount percentage or value
}, {
    versionKey: false,
    timestamps: true  // Adds createdAt and updatedAt fields
});

const CouponCode = mongoose.model("CouponCode", couponCodeSchema);

module.exports = CouponCode;
