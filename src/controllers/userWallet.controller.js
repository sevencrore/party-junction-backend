const express = require('express');
const getRoleByEmail =require('../middleware/AdminAuthMiddleware');
const router = express.Router();


// Assuming you have already defined UserWallet model
const UserWallet = require('../models/userWallet.model');

router.get('/getUserWallet/:userId', async (req, res) => {
    const { userId } = req.params; // Get the userId from the request parameters

    try {
        // Query the UserWallet collection by user_id
        const userWallet = await UserWallet.findOne({ user_id: userId });

        // Check if a wallet is found
        if (!userWallet) {
            return res.status(404).json({ message: 'User wallet not found' });
        }

        // Return the user wallet details
        return res.status(200).send(userWallet);
    } catch (error) {
        console.error('Error retrieving user wallet:', error);
        return res.status(500).json({ message: 'Server error, please try again later' });
    }
});



module.exports=router;