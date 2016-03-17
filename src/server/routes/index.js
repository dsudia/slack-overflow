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


router.get('/questions/:qid/answer/:aid/delete', helpers.ensureAdmin, function(req, res, next) {
  deleteAnswer();
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
