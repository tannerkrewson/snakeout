var express = require('express');
var socketio = require('socket.io');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var io = socketio();
app.io = io;

var devModeEnabled = (app.get('env') === 'development');

var Spyout = require('./app/spyout');
app.spyout = new Spyout(devModeEnabled);

require('./routes/socketio')(app);

// serve the compiled client code
app.use(express.static('dist'));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());

module.exports = app;
