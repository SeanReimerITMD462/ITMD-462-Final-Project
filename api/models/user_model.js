const mongoose = require('mongoose');

// Creating my mongoose Schema for users
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: { type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);