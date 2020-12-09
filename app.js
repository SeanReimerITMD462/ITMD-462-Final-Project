// Node Package Handler Variables
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Assigning variables to the file paths
const recipeRoutes = require ('./api/routes/recipes');
const orderRoutes = require ('./api/routes/orders');
const userRoutes = require ('./api/routes/users')

// Connecting to the mongoDB database URL link I copied from
// the mongoDB website I created specifically for this project
mongoose.connect('mongodb+srv://sreimer:' + process.env.MONGO_ATLAS_PW + 
    '@cluster0.dgnbv.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

// 
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Added an app.use function that will add headers for
// Access-Control-Origins and Access-Control-Headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

// Finding your project directory and its name
app.use(express.static(__dirname));
console.log("This is the directory listed in __dirname " + __dirname);
// Finding your styles directory
app.use('/styles', express.static(__dirname));
// Finding your images directory
app.use('/images', express.static(__dirname + '/images'));
// Finding your scripts directory
app.use('/scripts', express.static(__dirname + '/scripts'));

// Routes which should handle requests
app.use('/recipes', recipeRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

// Route them to the next error function or another page
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status(404);
    next(error);
});

// Creating a Response status to the error function
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;