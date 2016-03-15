var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../../../db/knex');
var passport = require('../lib/auth');
var bcrypt = require('bcrypt');
var helpers = require('../lib/helpers');

router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  knex('questions').select().then(function(data) {
    res.render('index', { title: 'Slack Overflow',
                          user: req.user, questions: data});
    // need to find a way to pull tags for every question - talk to an instructor
    // need to find a way to count number of answers for each question - ^^^
  });
});


router.get('/login', helpers.loginRedirect, function(req, res, next) {
  res.render('login', {message: req.flash('danger')});
});


router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    console.log('err', err);
    console.log('user', user);
    if (err) {

      return next(err);
    } else {
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  })(req, res, next);
});


router.get('/register', helpers.loginRedirect, function(req, res, next) {
  res.render('register', {message: req.flash('danger')});
});


router.post('/register', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var username = req.body.username;
  // check if email is unique
  knex('users').where('email', email)
    .then(function(data){
      // if email is in the database send an error
      if(data.length) {
          req.flash('danger', 'Email already exists.!');
          return res.redirect('/register');
      } else {
        // hash and salt the password
        var hashedPassword = helpers.hashing(password);
        // if email is not in the database insert it
        knex('users').insert({
          email: email,
          password: hashedPassword,
          first_name: first_name,
          last_name: last_name,
          username: username,
          auth_id: 3
        })
        .then(function(data) {
          req.flash('message', {
            status: 'success',
            message: 'Welcome!'
          });
          return res.redirect('/login');
        })
        .catch(function(err) {
          return res.send(err);
        });
      }
    })
    .catch(function(err){
      return next(err);
    });
});


router.get('/logout', helpers.ensureAuthenticated, function(req, res, next) {
  req.logout();
  res.redirect('/');
});


router.get('/questions/:id', function(req, res, next) {
  var qId = req.params.id;
  var questionData;
  var tagList = [];
  var answerList = [];
  if (qId === 'new') {
    res.render('newQuestion', {title: 'Slack Overflow - Post a Question'});
  } else if (qId !== 'new') {
    return knex('questions').where('id', qId).then(function(data) {
      questionData = data;
    }).then(function() {
      return knex('tags').select('tag_name').where('questions.id', qId)
      .join('question_tags', {'tags.id': 'question_tags.tag_id'})
      .join('questions', {'questions.id': 'question_tags.question_id'});
    }).then(function(tagData) {
      tagData.forEach(function(el, ind, arr) {
        return tagList.push(el.tag_name);
      });
    }).then(function() {
      return knex('answers').select().where('question_id', qId);
    }).then(function(answers) {
      answers.forEach(function(el, ind, arr) {
        return answerList.push(el);
      });
    }).then(function() {
      res.render('question', {title: 'Slack Overflow - ' + questionData.title,
        question: questionData[0],
        tags: tagList,
        answers: answerList});
    });
  }
});


router.post('/questions/add', function(req, res, next) {
  // store form info in a variable
  var qData = req.body;
  var tagList = req.body.tags;
  tagList = tagList.replace(/ /g, '');
  tagList = tagList.toLowerCase();
  var tagArray = tagList.split(',');
  var tagIds = [];
  var questionID;

  // insert question data into questions table, get question's ID back
  knex('questions').insert({title: qData.title,
    body: qData.body,
    group_id: qData.group_id,
    user_id: qData.user_id,
    score: 0,
    flag_status:false,
    assignment_id: qData.assignment_id}, 'id').then(function(id) {
    // store question ID in variable for later usage
    questionID = id;
  }).then(function() {
    // put tags into tags table and store ids in an array
    tagArray.forEach(function(el, ind, arr) {
      return knex('tags').insert({tag_name: el}, 'id').then(function(id) {
        tagIds.push(id);
      });
    });
  }).then(function() {
    // insert question/tag relationships into question_tags table
    tagIds.forEach(function(el, ind, arr) {
      knex('question_tags').insert({
        question_id: questionId,
        tag_id: el});
    });
  }).then(function(data) {
      //render question page
      res.redirect('/questions/' + questionID);
  });
});

router.post('/slack/question', function(req, res, next) {
  //parse object and store user_id, token, usernname, channel_id, text in variables
  var token = req.token;
  var userSlackId = req.user_id;
  var userSlackName = req.user_name;
  var message = req.text;
  var group = req.channel_id;
  var userId;

  // confirm token
  if (token !== process.env.SLACK_Q_TOKEN) {
    res.status(401).send('Invalid token');
  }

  // parse text into title, body and question.id and store in variables
  var messageArray = message.split('#');
  messageArray.shift();

  // look up user and store id
  knex('users').select('id').where('slack_id', userSlackId)
    .then(function(data) {
    userId = data[0];
  });

  //make post
    //store form info into variables
  var qData = messageArray;
  var tagList = messageArray[2];
  tagList = tagList.replace(/ /g, '');
  tagList = tagList.toLowerCase();
  var tagArray = tagList.split(',');
  var tagIds = [];
  var questionID;

    // insert question data into questions table, get question's ID back
  knex('questions').insert({title: messageArray[0],
    body: messageArray[1],
    group_id: group,
    user_id: userId,
    score: 0,
    flag_status:false}).then(function(id) {
    // store question ID in variable for later usage
    questionID = id;
  }).then(function() {
    // put tags into tags table and store ids in an array
    tagArray.forEach(function(el, ind, arr) {
      return knex('tags').insert({tag_name: el}, 'id').then(function(id) {
        tagIds.push(id);
      });
    });
  }).then(function() {
    // insert question/tag relationships into question_tags table
    tagIds.forEach(function(el, ind, arr) {
      knex('question_tags').insert({
        question_id: questionId,
        tag_id: el});
    });
  }).then(function(data) {
        //respond with text and question id
      res.status(200).header('Content-Type', 'application/json').send({
        'response_type': 'in_channel',
        'text': 'Thanks for posting a question to Slack Overflow ' + slackUserName + '! To respond to this question, type /sflowa #title #body #' + questionID
      });
  });
});



module.exports = router;
