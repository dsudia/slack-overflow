var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../../../db/knex');
var quesQueries = require("../../../queries/questions");
var answerQueries = require('../../../queries/answers');
var tagQueries = require('../../../queries/tags');
var helpers = require('../lib/helpers');
var Promise = require('bluebird');


router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  var questionData;
  var answerCountArray;
  var tagArray;
  return quesQueries.getAllQuestionsAndUsers()
    .then(function(data) {
      questionData = data;
    })
    .then(function() {
      return answerQueries.getAnswerCount();
    })
    .then(function(data) {
      answerCountArray = data;
    })
    .then(function() {
      return tagQueries.getAllQuestionTags();
    })
    .then(function(data) {
      tagArray = data;
    })
    .then(function() {
      console.log(req.user);
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
