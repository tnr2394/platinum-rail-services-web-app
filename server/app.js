var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var properties = require('./config/properties');
// var db = require('./config/database');
var bodyParser = require('body-parser');
var cors = require('cors');
const fileUpload = require('express-fileupload');
const expressSession = require("express-session");
const http = require('http');
const fs = require('fs');
const https = require('https');
const cron = require('node-cron');
// Set up debugging/logging for the development environment
var debug = require('debug')('http');

config = {}
config.env = require('./config/env.config')

// Set up database connection to use throughout the application
config.db = require(path.join(__dirname, 'config', 'database'));


// db();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var coursesRouter = require('./routes/courses');
var instructorsRouter = require('./routes/instructors');
var clientsRouter = require('./routes/clients');
var jobsRouter = require('./routes/job');
var learnersRouter = require('./routes/learner');
var materialsRouter = require('./routes/materials');
var adminRouter = require('./routes/admin');

const instructorController = require('./controllers/instructor.controller');

// Make the settings in the environment config global available
global.settings = config.env.settings;


var app = express();
//configure bodyparser

app.use(expressSession({
  secret: "platinum",
  resave: true,
  saveUninitialized: true,
  cookie: {
    sameSite: true,
  },
}));

var sass;


var bodyParserJSON = bodyParser.json();
var bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });

app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  credentials: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.moment = require('moment');


if (config.env.name === 'production') {
  var credentials = {
    key: fs.readFileSync('/var/www/html/platinum/ssl/privkey1.pem'),
    cert: fs.readFileSync('/var/www/html/platinum/ssl/fullchain1.pem')
  };

  var server = https.createServer(credentials, app);
  server.listen(config.env.port);
  server.on('error', onError);
  server.on('listening', onListen);


} else if (config.env.name === 'testing') {

  var credentials = {
    key: fs.readFileSync('/var/www/html/platinum/ssl/privkey1.pem'),
    cert: fs.readFileSync('/var/www/html/platinum/ssl/fullchain1.pem')
  };

  var server = http.createServer(app);
  server.listen(config.env.port);
  server.on('error', onError);
  server.on('listening', onListen);

  // Development and Testing mode
} else {
  if (config.env.name === 'development' && config.env.https) {
    var server = https.createServer({
      key: fs.readFileSync('/var/www/html/platinum/ssl/privkey1.pem'),
      cert: fs.readFileSync('/var/www/html/platinum/ssl/fullchain1.pem')
    }, app);
  } else {
    var server = http.createServer(app);
  }

  server.listen(config.env.port);
  server.on('error', onError);
  server.on('listening', onListen);

}

// const checkQualificationCronJob = cron.schedule('1 * * * * *', () => {

//   console.log('Is Running Now');
//   instructorController.checkForQualificationCronJob();
// }, {
//     scheduled: true,
//   });

// checkQualificationCronJob.start();


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/courses', coursesRouter);
app.use('/instructors', instructorsRouter);
app.use('/clients', clientsRouter);
app.use('/jobs', jobsRouter);
app.use('/learners', learnersRouter);
app.use('/materials', materialsRouter);
app.use('/admin', adminRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in develo   pment
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Error trapping for HTTP/HTTPS server
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  if (typeof port === 'string') {
    var bind = 'pipe ' + config.env.port;
  } else {
    var bind = 'port ' + config.env.port;
  }

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Print message to console and debugger when the HTTP/HTTPS server is listening
function onListen() {
  var addr = server.address();
  if (typeof addr === 'string') {
    var bind = 'pipe ' + addr;
  } else {
    var bind = 'port ' + addr.port;
  }
  if (config.env.name === 'production') {
    console.log('HTTPS server is listening on ' + bind + '.');
    debug('HTTPS server is listening on ' + bind + '.');

  } else {
    console.log('HTTP server is listening on ' + bind + '.');
    debug('HTTP server is listening on ' + bind + '.');
  }
}


// For Stop Console logs 
// console.log = function () { }


module.exports = app;
