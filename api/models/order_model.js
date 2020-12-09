const mongoose = require('mongoose');

// Creating my mongoose Schema for orders
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    recipeID: { type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe', required: true },
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);