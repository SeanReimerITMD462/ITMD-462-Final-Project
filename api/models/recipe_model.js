const mongoose = require('mongoose');

// Creating my mongoose Schema for recipes
const recipeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    recipeName: { type: String, required: true},
    totalCost: { type: Number, required: true},
    entreeName: { type: String, required: true},
    quantityAmount: { type: Number, required: true}
});

module.exports = mongoose.model('Recipe', recipeSchema);