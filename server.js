'use strict';

// Loading dependencies.
var express = require('express'),
    config = require('./run/config');

// Instantiating the framework and a router for our requests.
var app = express(),
    router = express.Router();

// The port which this script will listen to.
var apiPort = process.env.PORT || 5000;

// Statically serving our `dist` folder.
app.use(express.static(config.destPath));

// Listen for the above routes on the following port.
app.listen(apiPort);

// Debugging to the console that the server has started.
console.log('Mock API Server: http://localhost:' + apiPort + '/');
