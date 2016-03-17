var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../../../db/knex');
var passport = require('../lib/auth');
var queries = require("../../../queries");
var bcrypt = require('bcrypt');
var helpers = require('../lib/helpers');
var request = require('request-promise');


router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  var questionData;
  var answerCountArray;
  knex('questions').select('questions.title', 'questions.id', 'questions.body', 'questions.score', 'users.username')
    .join('users', {
      'questions.user_id': 'users.id'
    })
    .then(function(data) {
      questionData = data;
    })
    .then(function() {
      return knex('answers').select('question_id').count().groupBy('question_id');
    })
    .then(function(data) {
      console.log('answer counts', data);
      answerCountArray = data;
    })
    .then(function() {
      console.log(answerCountArray);
      res.render('index', {
        title: 'Slack Overflow',
        user: req.user,
        questions: questionData,
        slack: req.user.slack_id,
        answerCount: answerCountArray
      });
    });
});


router.get('/logout', helpers.ensureAuthenticated, function(req, res, next) {
  req.logout();
  res.redirect('/');
});


router.get('/questions/:id', helpers.ensureAuthenticated, function(req, res, next) {
  // need to show author's name
  var userId = req.user.id;
  var qId = req.params.id;
  var questionData;
  var tagList = [];
  var answerList = [];
  if (qId === 'new') {
    return knex('groups')
      .then(function(cohorts) {
        res.render('newQuestion', {
          user: req.user,
          cohorts: cohorts,
          title: 'Slack Overflow - Post a Question'
        });
      });
  } else if (qId !== 'new') {
    return knex('questions').select('questions.id', 'questions.title', 'questions.body', 'questions.score', 'users.username')
      .join('users', {
        'questions.user_id': 'users.id'
      })
      .where({
        'questions.id': qId
      }).then(function(data) {
        questionData = data;
      }).then(function() {
        return knex('tags').select('tag_name').where('questions.id', qId)
          .join('question_tags', {
            'tags.id': 'question_tags.tag_id'
          })
          .join('questions', {
            'questions.id': 'question_tags.question_id'
          });
      }).then(function(tagData) {
        tagData.forEach(function(el, ind, arr) {
          return tagList.push(el.tag_name);
        });
      }).then(function() {
        return knex('answers').select('answers.id', 'answers.title', 'answers.body', 'users.username')
          .join('users', {
            'answers.user_id': 'users.id'
          })
          .where('question_id', qId);
      }).then(function(answers) {
        console.log(answers);
        answers.forEach(function(el, ind, arr) {
          return answerList.push(el);
        });
      }).then(function() {
        res.render('question', {
          title: 'Slack Overflow - ' + questionData.title,
          question: questionData[0],
          tags: tagList,
          answers: answerList,
          user: req.user
        });
      });
  }
});


router.post('/questions/add', helpers.ensureAuthenticated, function(req, res, next) {
  // store form info in a variable
  var user = req.user;
  var qData = req.body;
  console.log(qData.user_id);
  var tagList = req.body.tags;
  tagList = tagList.replace(/ /g, '');
  tagList = tagList.toLowerCase();
  var tagArray = tagList.split(',');
  var tagIds = [];
  var questionID;
  var body = markdown.toHTML(qData.body);

  // insert question data into questions table, get question's ID back
  knex('questions').insert({
    title: qData.title,
    body: body,
    group_id: qData.group_id,
    user_id: req.user.id,
    score: 0,
    flag_status: false,
    assignment_id: qData.assignment_id
  }, 'id').then(function(id) {
    // store question ID in variable for later usage
    questionID = id;
  }).then(function() {
    // put tags into tags table and store ids in an array
    tagArray.forEach(function(el, ind, arr) {
      return knex('tags').insert({
        tag_name: el
      }, 'id').then(function(id) {
        tagIds.push(id);
      });
    });
  }).then(function() {
    // insert question/tag relationships into question_tags table
    tagIds.forEach(function(el, ind, arr) {
      knex('question_tags').insert({
        question_id: questionId,
        tag_id: el
      });
    });
  }).then(function(data) {
    //render question page
    res.redirect('/questions/' + questionID);
  });
});


router.get('/questions/:id/answer', function(req, res, next) {
  var qId = req.params.id;
  var questionData;

  knex('questions').where('id', qId)
    .then(function(data) {
      questionData = data[0];
      res.render('newAnswer', {
        user: req.user.id,
        questionId: req.params.id,
        question: questionData
      });
    });
});


router.post('/questions/:id/answer', function(req, res, next) {
  var aData = req.body;
  userId = req.user.id;
  var body = aData.body;
  var channelArray = [];
  var userArray = [];

  return knex('answers').insert({
      title: aData.title,
      body: aData.body,
      question_id: req.params.id,
      user_id: userId,
      score: 0,
      flag_status: false
    })
    .then(function() {
      // look through subscriptions table for this question id
      // look up slack user_ids for all users associated with this question
      return knex('users').select('slack_id', 'slack_access_token')
        .join('subscriptions', {
          'users.id': 'subscriptions.user_id'
        })
        .where('subscriptions.question_id', req.params.id);
    })
    .then(function(users) {
      console.log('users', users);
      // if there are subscribed users, open a channel with all subscribed users
      if (users[0] !== undefined) {
        for (i = 0; i < users.length; i++) {
          return request('https://slack.com/api/im.open?token=' + users[i].slack_access_token + '&user=' + users[i].slack_id, function(err, res, body) {})
            .then(function(response) {
              console.log('response', response);
              var resBody = JSON.parse(response);
              return channelArray.push({
                channel: resBody.channel.id,
                userToken: users[i].slack_access_token
              });
            });
        }
      }

    })
    .then(function() {
      // post a message in each channel
      if (channelArray[0] !== undefined) {
        for (i = 0; i < channelArray.length; i++) {
          return request('https://slack.com/api/chat.postMessage?token=' + channelArray[i].userToken + '&channel=' + channelArray[i].channel + '&text=Question%20' + req.params.id + '%20was%20just%20answered!',
            function(err, res, body) {
              console.log('posted a message to channel: ', channelArray[0]);
            });
        }
      }

    })
    .then(function() {
      res.redirect('/questions/' + req.params.id);
    });

});

router.get('/questions/:id/delete', helpers.ensureAdmin, function(req, res, next) {
  knex('question_tags').where('question_id', req.params.id).del()
    .then(function() {
      return knex('answers').where('question_id', req.params.id).del();
    })
    .then(function() {
      return knex('subscriptions').where('question_id', req.params.id).del();
    })
    .then(function() {
      return knex('questions').where('id', req.params.id).del();
    })
    .then(function() {
      res.redirect('/');
    });
});

router.get('/questions/:qid/answer/:aid/delete', helpers.ensureAdmin, function(req, res, next) {
  knex('answers').where('id', req.params.aid).del()
    .then(function() {
      res.redirect('/questions/' + req.params.qid);
    });
});

router.get('/questions/:id/flag', function(req, res, next) {
  return knex('questions').where('id', req.params.id).update('flag_status', true)
    .then(function() {
      res.redirect('/questions/' + req.params.id);
    });
});

router.get('/questions/:id/unflag', helpers.ensureAdmin, function(req, res, next) {
  return knex('questions').where('id', req.params.id).update('flag_status', false)
    .then(function() {
      res.redirect('/questions/' + req.params.id);
    });
});

router.get('/questions/:qid/answer/:aid/flag', function(req, res, next) {
  return knex('answers').where('id', req.params.aid).update('flag_status', true)
    .then(function() {
      res.redirect('/questions/' + req.params.qid);
    });
});

router.get('/questions/:qid/answer/:aid/unflag', helpers.ensureAdmin, function(req, res, next) {
  return knex('answers').where('id', req.params.aid).update('flag_status', false)
    .then(function() {
      res.redirect('/questions/' + req.params.qid);
    });
});

router.post('/questions/:id/voteup', helpers.ensureAuthenticated, function(req, res, next) {
  return knex('questions').select('score').where('id', req.params.id)
    .then(function(data) {
      return (Number(data[0].score) + 1);
    })
    .then(function(newScore) {
      return knex('questions').where('id', req.params.id).update('score', newScore);
    })
    .then(function(data) {
      res.status(200).send('score updated correctly');
    });
});

router.post('/questions/:id/votedown', helpers.ensureAuthenticated, function(req, res, next) {
  return knex('questions').select('score').where('id', req.params.id)
    .then(function(data) {
      return (Number(data[0].score) - 1);
    })
    .then(function(newScore) {
      return knex('questions').where('id', req.params.id).update('score', newScore);
    })
    .then(function(data) {
      res.status(200).send('score updated correctly');
    });
});

router.post('/answers/:id/voteup', helpers.ensureAuthenticated, function(req, res, next) {
  return knex('answers').select('score').where('id', req.params.id)
    .then(function(data) {
      return (Number(data[0].score) + 1);
    })
    .then(function(newScore) {
      return knex('answers').where('id', req.params.id).update('score', newScore);
    })
    .then(function(data) {
      res.status(200).send('score updated correctly');
    });
});

router.post('/answers/:id/votedown', helpers.ensureAuthenticated, function(req, res, next) {
  return knex('answers').select('score').where('id', req.params.id)
    .then(function(data) {
      return (Number(data[0].score) - 1);
    })
    .then(function(newScore) {
      return knex('answers').where('id', req.params.id).update('score', newScore);
    })
    .then(function(data) {
      res.status(200).send('score updated correctly');
    });
});

router.post('/questions/subscribe/:id', helpers.ensureAuthenticated, function(req, res, next) {
  user = req.user.id;
  return knex('subscriptions').insert({
      'user_id': user,
      'question_id': req.params.id
    })
    .then(function() {
      res.status(200).send('You are subscribed!');
    });
});

router.post('/questions/unsubscribe/:id', helpers.ensureAuthenticated, function(req, res, next) {
  user = req.user.id;
  return knex('subscriptions').where({
      'user_id': user,
      'question_id': req.params.id
    }).del()
    .then(function() {
      res.status(200).send('You have unsubscribed!');
    });
});

module.exports = router;
