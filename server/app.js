var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var properties = require('./config/properties');
var db = require('./config/database');
var bodyParser = require('body-parser');
var cors = require('cors');
const fileUpload = require('express-fileupload');
const expressSession = require("express-session");

db();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var coursesRouter = require('./routes/courses');
var instructorsRouter = require('./routes/instructors');
var clientsRouter = require('./routes/clients');
var jobsRouter = require('./routes/job');
var learnersRouter = require('./routes/learner');
var materialsRouter = require('./routes/materials');
var adminRouter = require('./routes/admin');

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
// Add headers
// app.use(function (req, res, next) {
//   console.log("Setting header for allowing origin")
//   res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.83:4200');
//   next();
// });

app.locals.moment = require('moment');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



require('dotenv').config();

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


module.exports = app;
