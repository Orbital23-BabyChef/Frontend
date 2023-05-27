const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
        required: true,
        minlength: 3
    },
    ingredients: {
        type: String,
        required: true,
        minlength:3
    },
    instructions: {
        type: String,
        required: true,
        minlength:3
    },
    creator: {
        type: String,
        required: true
    },
}, {
  timestamps: true,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;