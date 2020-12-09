// Node Package Handler Variables
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Assigning variables to the file paths
const User = require('../models/user_model');

// Pass in the Users, and push them into the mongoDB 'test -> users' collection
router.get('/', (req, res, next) => {
    User.find()
        //.select('_id name price')
        .select('-__v') // removing the __v property
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        user: doc,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/users/" + doc._id
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

// Create a new user with the POST function
router.post('/', (req, res, next) => {
    // Creating new mongoose Type id
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        userName: req.body.userName
    });
    user
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Submitted new user successfully',
                createdUser: {
                    userName: result.userName,
                    _id: result._id
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/users/" + result._id
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

// Retreive and get all of those users that were created with the POST function
router.get('/:userID', (req, res, next) => {
    const id = req.params.userID;
    User.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            res.status(200).json({
                user: doc,
                request: {
                    type: 'GET',
                    description: 'Get all users',
                    url: 'http://localhost:3000/users'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// Update the users that were created with the POST function
router.patch('/:userID', (req, res, next) => {
    const id = req.params.userID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    };
    User.updateOne({ _id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/users/' + id // not _id
                } 
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// Delete the users that were created with the POST function
router.delete('/:userID', (req, res, next) => {
    const id = req.params.userID;
    User.deleteOne({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/users',
                    body: { userName: 'String' }
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

// Get a special user ID
router.get('/:userID', (req, res, next) => {
    const id = req.params.userID;
    if (id == 'special') {
        res.status(200).json({
            message: 'You discovered the special user ID',
            id: id
        });
    } else { // You got a normal user ID
        res.status(200).json({
            message: 'You passed a normal user ID',
            id: id
        });
    };
});

module.exports = router;