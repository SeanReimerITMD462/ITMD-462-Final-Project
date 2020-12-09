// Node Package Handler Variables
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Assigning variables to the file paths
const Recipe = require('../models/recipe_model');

// Pass in the ingredients that go into the Recipe, and push them into the mongoDB 'test -> recipes' collection
router.get('/', (req, res, next) => {
    Recipe.find()
        //.select('_id name price')
        .select('-__v') // removing the __v property
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                recipes: docs.map(doc => {
                    return {
                        recipe: doc,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/recipes/" + doc._id
                        }
                    }
                })
            }
            // If you would like to, you may use the following if/else loop.  It notifies you if you have no
            // Recipes that are located in the 'test -> recipes' collection
            // if (docs.length > 0) {
                res.status(200).json(response);
            /* } else {
                res.status(404).json({
                    message: 'No entries found'
                });
            } */
        })
        .catch(err => {
            console.log(err);
            res.status(500),json({
                error: err
            });
        });
});

// Create a new recipe with the POST function
router.post('/', (req, res, next) => {
    // Creating new mongoose Type id
    const recipe = new Recipe({
        _id: new mongoose.Types.ObjectId(),
        recipeName: req.body.recipeName,
        totalCost: req.body.totalCost,
        entreeName: req.body.entreeName,
        quantityAmount: req.body.quantityAmount
    });
    recipe
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Submitted new recipe successfully',
                createdRecipe: {
                    recipeName: result.recipeName,
                    totalCost: result.totalCost,
                    entreeName: result.entreeName,
                    quantityAmount: result.quantityAmount,
                    _id: result._id
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/recipes/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Retreive and get all of those recipes that were created with the POST function
router.get('/:recipeID', (req, res, next) => {
    const id = req.params.recipeID;
    Recipe.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            res.status(200).json({
                recipe: doc,
                request: {
                    type: 'GET',
                    description: 'Get all recipes',
                    url: 'http://localhost:3000/recipes'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// Update the recipes that were created with the POST function
router.patch('/:recipeID', (req, res, next) => {
    const id = req.params.recipeID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    };
    Recipe.updateOne({ _id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Recipe updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/recipes/' + id // not _id
                } 
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// Delete the recipes that were created with the POST function
router.delete('/:recipeID', (req, res, next) => {
    const id = req.params.recipeID;
    Recipe.deleteOne({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Recipe deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/recipes',
                    body: { recipeName: 'String', totalCost: 'Number', entreeName: 'String', quantityAmount: 'Number' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;