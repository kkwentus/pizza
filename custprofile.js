var mongoose = require('mongoose');

//create the DB model
var custProfile = mongoose.model('profile', {
    username: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    gender: {
        type: String,
        trim: true
    },
    googlecount: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        required: true
    },
    verified: {
        type: String,
        default: false
    }
});

module.exports = {
    custProfile
};