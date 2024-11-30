const express = require('express');
const getRoleByEmail =require('../middleware/AdminAuthMiddleware');
const router = express.Router();

const CouponCode = require('../models/couponCode.model');

router.post("/create", async (req, res) => {
    try {
        const { name, discount } = req.body;

        // Convert name to uppercase
        const upperCaseName = name.toUpperCase();

        // Check if a coupon with the same name already exists
        const existingCoupon = await CouponCode.findOne({ name: upperCaseName });
        if (existingCoupon) {
            return res.status(400).json({ message: "A coupon with this name already exists." });
        }

        // Create the coupon
        await CouponCode.create({ name: upperCaseName, discount });
        return res.status(200).json({ message: "Coupon created successfully!" });
    } catch (error) {
        console.error("Error creating coupon:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});




router.get("/search/:name", async (req, res) => {
    try {
        const { name } = req.params;

        // Convert name to uppercase
        const upperCaseName = name.toUpperCase();

        // Search for the coupon
        const coupon = await CouponCode.findOne({ name: upperCaseName });
        if (!coupon) {
            return res.status(200).json({ message: "Coupon not found." });
        }

        // Return the discount
        return res.status(200).json({ discount: coupon.discount });
    } catch (error) {
        console.error("Error searching for coupon:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});


module.exports=router;