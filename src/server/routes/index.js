var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../../../db/knex');
var queries = require("../../../queries");
var helpers = require('../lib/helpers');
var Promise = require('bluebird');


router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  var questionData;
  var answerCountArray;
  var tagArray;
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
      return knex('tags').select('tags.tag_name', 'question_tags.question_id')
        .join('question_tags', {'question_tags.tag_id': 'tags.id'});
    })
    .then(function(data) {
      tagArray = data;
    })
    .then(function() {
      console.log(answerCountArray);
      res.render('index', {
        title: 'Slack Overflow',
        user: req.user,
        questions: questionData,
        slack: req.user.slack_id,
        answerCount: answerCountArray,
        tags: tagArray
      });
    });
});


module.exports = router;
