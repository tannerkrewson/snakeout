var express = require('express');
var socketio = require('socket.io');
var logger = require('morgan');

var app = express();
var io = socketio();
app.io = io;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var devModeEnabled = (app.get('env') === 'development');

// startup the server-side code
var Spyout = require('./app/spyout');
app.spyout = new Spyout(devModeEnabled);
require('./routes/socketio')(app);

// serve the compiled client code
app.use(express.static('dist'));

module.exports = app;
