const mongoose = require('mongoose');

const slideImageSchema = new mongoose.Schema({
    name: { type: String  },  // Name of the image
    description: { type: String },  // Description of the image
    image: { type: String },  // URL for the slider image
    is_active: { type: String, default: '1' },  // '1' for active, '0' for inactive
    is_deleted : {type : String,default : '0'},
}, {
    versionKey: false,
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

const SlideImage = mongoose.model("SlideImage", slideImageSchema);

module.exports = SlideImage ;
