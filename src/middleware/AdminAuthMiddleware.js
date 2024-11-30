const express = require('express');
const User = require('../models/user.model');

async function getRoleByEmail(req, res, next) {
    const { email } = req.body;
    console.log(req.body)

    try {
        // Find user by email and only select the 'role' field
        const user = await User.findOne({ email }).select('role');
        console.log(user);
        const userObject = user.toObject();
        console.log(userObject.role);
    
        if (user && userObject.role == 'admin') {
            next();
        } else {
            console.log('Unauthorized User');
            return res.status(401).json({ message: "Unauthorized User" });
        }
    } catch (error) {
        console.error('Error fetching user role:', error);
        return res.status(500).json({ message: "Server Error" });
    }
}

module.exports = getRoleByEmail;
