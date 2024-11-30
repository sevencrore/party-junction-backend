const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Name of the vendor
    email: { type: String },  // Name of the vendor
    description: { type: String },  // Description of the vendor
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID
    balance : {type:Number, default:0},// user wallet for refer and earn
    is_active: { type: String, default: '1' },  // '1' for active, '0' for inactive
    is_deleted : {type : String,default : '0'},
}, {
    versionKey: false,
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

const Wallet = mongoose.model("UserWallet", walletSchema);

module.exports = Wallet;
