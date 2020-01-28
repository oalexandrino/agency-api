var request = require('request');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// api configuration
var ApiConfiguration = require('./app_api/lib/agency/settings/ApiConfiguration');

// mongo
var mongoose = require('mongoose');
var MongoConnection = require('./app_api/lib/agency/db/mongo/MongoConnection');
const objConnection = new MongoConnection(mongoose);
objConnection.start();
objConnection.registerSchemas();

//cloudinary
var cloudinarySettings = require('./app_api/lib/agency/upload/CloudinarySettings');

// for uploading
var bodyParser = require('body-parser');
var path = require('path');

// express app
var app = express();

// let the app to get access to static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('./resources/images_uploads/', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// firebase
const firebase = require('firebase');
var FirebaseConnection = require('./app_api/lib/agency/db/firebase/FirebaseConnection');
const objFirebaseConnection = new FirebaseConnection(firebase);

// routes
var server_routers = require('./app_server/routes/server_routers');
var api_routers  = require('./app_api/routes/api_routers');

// catching and disabling favicon error
app.get('/favicon.ico', (req, res) => res.status(204));

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// using routes
app.use('/', server_routers);
app.use('/api', api_routers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err.stack);
  // render the error page
  res.status(err.status || 500).send('Error 500: Something broke!');
  res.render('error');
});

module.exports = app, objFirebaseConnection;