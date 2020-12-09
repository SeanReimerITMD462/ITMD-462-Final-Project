// Node Package Handler Variables
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Assigning variables to the file paths
const Order = require('../models/order_model');
const Recipe = require('../models/recipe_model');
const User = require('../models/user_model');

// Retrieving all orders
router.get('/', (req, res, next) => {
    Order.find()
        .select('-__v') // Gets rid of the display of the order version
        .populate('recipe', '-__v') // Grabs the order and displays its info 
        .exec() // Executes
        .then(docs => { // Then, do the following
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        order: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => { // If there is an error, catch it
            res.status(500).json({
                error: err
            });
        })
});

// Creating orders with the POST function
router.post('/', (req, res, next) => {
    Recipe.findById(req.body.recipeID)
    .then(recipe => {
        if (!recipe) { // If recipe does not exist, display message
            return res.status(404).json({
                message: 'Recipe not found'
            });
        } else { // Create order
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                recipe: req.body.recipeID
            });
            return order.save()
        }
    }) // Store that order
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored',
            createdOrder: {
                _id: result.id,
                recipe: result.recipe,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
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

// Retreive and get all of those orders that were created with the POST function
router.get('/:orderID', (req, res, next) => {
    Order.findById(req.params.orderID)
        .select('-__v')
        .populate('recipe', '-__v') // Grabs the recipe and displays its info
        .exec()
        .then(order => {
            if (!order) { // If order does not exist, display message
                return res.status(404).json({
                    message: 'Order not found'
                });
            } else {
                res.status(200).json({
                    order: order,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders'
                    }
                });
            }
        })
        .catch(err => {
            res.status(500),json({
                error: err
            });
        });
});

// Delete the orders that were created with the POST function
router.delete('/:orderID', (req, res, next) => {
    Order.deleteOne({_id: req.params.orderID})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: { recipeID: "recipe ID", quantity: "Number" }
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