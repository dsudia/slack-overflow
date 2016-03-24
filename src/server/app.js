// *** main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var flash = require('connect-flash');
var session = require('express-session');
var Promise = require('bluebird');
var passport = require('./lib/passport');
var knex = require('../../db/knex');
var helpers = require('./lib/helpers');
var bot = require('./bot');
if ( !process.env.NODE_ENV ) { require('dotenv').config(); }


//start bot
bot();


// *** routes *** //
var routes = require('./routes/index');
var authRoutes  = require('./routes/auth');
var assignmentRoutes = require('./routes/assignments');
var questionRoutes = require('./routes/questions');
var slackRoutes = require('./routes/slack');
var loginRoutes = require('./routes/login');
var logoutRoute = require('./routes/logout');
var answerRoutes = require('./routes/answers');
var staffRoutes = require('./routes/staff');


// *** express instance *** //
var app = express();


// *** view engine *** //
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');


// *** static directory *** //
app.set('views', path.join(__dirname, 'views'));


// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));
app.use(session({
  secret: process.env.SECRET_KEY || 'change_me',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// *** main routes *** //
app.use('/', routes);
app.use('/auth', authRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/questions', questionRoutes);
app.use('/slack', slackRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoute);
app.use('/answers', answerRoutes);
app.use('/staff', staffRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
