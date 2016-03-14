// *** main dependencies *** //
require('dotenv').config();
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
var passport = require('./lib/auth');
var GitHubStrategy = require('passport-github').Strategy;
var knex = require('../../db/knex');
var cookieSession = require('cookie-session');

if ( !process.env.NODE_ENV ) { require('dotenv').config(); }


// *** routes *** //
var routes = require('./routes/index.js');
var authRoutes  = require('./routes/auth.js');


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
app.use(cookieSession({
  name: 'change_me',
  keys: [process.env.KEY1, process.env.KEY2, process.env.KEY3]
}));
app.use(express.static(path.join(__dirname, '../client')));
app.use(session({
  secret: process.env.SECRET_KEY || 'change_me',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// *** passport middleware ***//
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/github/callback"
  }, function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    knex('users')
      .where({ id: profile.id})
      .orWhere({ email: profile.email})
      .first()
      .then(function (user) {

        if (!user) {
        console.log(profile.displayName);
        var names = profile.displayName.split(' ');
        var firstname = names[0];
        var lastname = names[names.length-1];
          return knex('users').insert({
            github_id: profile.id,
            github_login: profile.username,
            github_avatar: profile.photos[0].value,
            email: profile.emails[0].value,
            auth_id: 3,
            first_name: firstname,
            last_name: lastname,
            username: profile.username,
            password: 'not_needed'}, 'id').then(function(id){
              return done(null, id[0]);
            });
          } else {
        return done(null, user.id);
      }
    });
}));

// *** configure passport *** //
passport.serializeUser(function(userID, done) {
  done(null, userID);
});

passport.deserializeUser(function(userID, done) {
if (userID) {
    knex('users').where('id', userID).select()
      .then(function (user) {
        console.log(user[0]);
        ( !user ) ? done() : done(null, user[0]);
      })
      .catch(function (err) {
        done(err, null);
      });
  } else {
    done();
  }
});


// *** main routes *** //
app.use('/', routes);
app.use('/auth', authRoutes);


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
