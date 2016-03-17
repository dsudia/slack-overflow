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
var GitHubStrategy = require('passport-github').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var SlackStrategy = require('passport-slack').Strategy;
var knex = require('../../db/knex');
var helpers = require('./lib/helpers');
if ( !process.env.NODE_ENV ) { require('dotenv').config(); }


// *** configure Slack bot *** //

//create RTM client
var RtmClient = require('@slack/client').RtmClient;
var token = process.env.SLACK_BOT_TOKEN || '';
var rtm = new RtmClient(token);
rtm.start();

// capture rtm.start payload
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData) {
  console.log('You are authenticated!');
});

// listen to messages
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
rtm.on(RTM_EVENTS.MESSAGE, function(message) {
  console.log('You received this message: ', message);
  var text = message.text;
  text = text.toLowerCase();
  var channel = message.channel;
  var quesResponse = 'Thanks for asking! To ask a question, you use the / command /sflowq. \nThe format for a question is #title #body #tags,tags. An example would be #Trouble with array.filter function... #Hey all, I\'m having a lot of difficulty with higher-order functions. When I use array.filter, I\'m not gettting the return I\'m expecting. #javascript,functions,arrays';
  var ansResponse = 'Thanks for asking! To answer a question, you use the / command /sflowa\nWhen a question gets asked, I will respond with the question ID. You can answer a question with the following format: #title #body #questionId.\nLike so: #Array.filter #When you filter an array, remember to return what\'s inside the callback function. The filter returns elements that match the true value of the callback. #189\nThen I\'ll respond with confirmation your answer has been posted.';
  var fullResponse = 'Thanks for asking! To use my service, you can use two slash commands.\n/sflowq will tell me to post a question.\n/sflowa will tell me to post an answer.\nThe format for a question is #title #body #tags,tags. An example would be #Trouble with array.filter function... #Hey all, I\'m having a lot of difficulty with higher-order functions. When I use array.filter, I\'m not gettting the return I\'m expecting. #javascript,functions,arrays\nWhen a question gets asked, I will respond with the question ID. You can answer a question with the following format: #title #body #questionId.\nLike so: #Array.filter #When you filter an array, remember to return what\'s inside the callback function. The filter returns elements that match the true value of the callback. #189\nThen I\'ll respond with confirmation your answer has been posted. Thanks for using Slack Overflow!';
  var instResponse = 'Howdy! You can ask me the following questions for more info: "How do I post a question on Slack Overflow?", "How do I post an answer on Slack Overflow?" and "How do I use Slack Overflow?"';
  if (text.includes('how') && text.includes('post') && text.includes('overflow') && text.includes('question')) {
    rtm.sendMessage(quesResponse, channel, function messageSent() {
      console.log ('Question response sent!');
    });
  } else if (text.includes('how') && text.includes('post') && text.includes('overflow') && text.includes('answer')) {
    rtm.sendMessage(ansResponse, channel, function messageSent() {
      console.log('Answer response sent!');
    });
  } else if (text.includes('how') && text.includes('use') && text.includes('overflow')) {
    rtm.sendMessage(fullResponse, channel, function messageSent() {
      console.log('Full response sent!');
    });
  } else if (text.includes('hey slack overflow')) {
    rtm.sendMessage(instResponse, channel, function(messageSent) {
      console.log('Instructions sent!');
    });
  }
});

rtm.on(RTM_EVENTS.CHANNEL_CREATED, function(message) {
  var text = message.text;
  text = text.toLowerCase();
  var channel = message.channel;
  var introMessage = 'Hey there! You can type "Hey Slack Overflow" at any time to get more instructions on using the service!';
  rtm.sendMessage(introMessage, channel, function messageSent() {
    console.log('Intro message sent on new channel creation!');
  });
});

var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;


// *** routes *** //
var routes = require('./routes/index');
var authRoutes  = require('./routes/auth');
var assignmentRoutes = require('./routes/assignments');
var questionRoutes = require('./routes/questions');
var slackRoutes = require('./routes/slack');
var loginRoutes = require('./routes/login');
var registerRoutes = require('./routes/register');
var logoutRoute = require('./routes/logout');
var answerRoutes = require('./routes/answers');

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
app.use('/register', registerRoutes);
app.use('/logout', logoutRoute);
app.use('/answers', answerRoutes);


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
