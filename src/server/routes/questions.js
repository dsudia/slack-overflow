var express = require("express");
var router = express.Router();
var queries = require("../../../queries");
var knex = require('../../../db/knex.js');
var passport = require('passport');
var helpers = require('../lib/helpers');
var addQuestion = require('./questionRoutes/addQuestion');
var getAnswerPage = require('./answerRoutes/getAnswerPage');
var postQuestion = require('./answerRoutes/postAnswer');
var deleteQuestion = require('./questionRoutes/deleteQuestion');
var deleteAnswer = require('./answerRoutes/deleteAnswer');
var flagQuestion = require('./questionRoutes/flagQuestion');
var flagAnswer = require('./answerRoutes/flagAnswer');
var voteQuestion = require('./questionRoutes/voteQuestion');


router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  var assignmentID = req.query.assignment;
  var scope = req.query.scope;
  queries.getQuestions(assignmentID, scope)
  .then(function(questions){
      res.render('questions', {questions:questions,
                              scope: scope})
  })
  .catch(function(err) {
    console.log(err);
   });
});

router.get('/:questionID', helpers.ensureAuthenticated, function(req, res, next) {
  var questionID = req.params.questionID;;
  var scope = req.query.scope;
  queries.getQuestions(assignmentID, scope)
  .then(function(question){
      queries.getAnswers(questionID,scope)
  })
  .then(function(answers){
      res.render('question', {question:question,
                              answers: answers})
  })
  .catch(function(err) {
    console.log(err);
   });
});


router.post('/add', helpers.ensureAuthenticated, function(req, res, next) {
  addQuestion(res, res, next);
});

router.get('/:id/answer', helpers.ensureAuthenticated, function(req, res, next) {
  getAnswerPage(req, res, next);
});

router.post('/:id/answer', helpers.ensureAuthenticated, function(req, res, next) {
  postAnswer(req, res, next);
});

router.get('/:id/delete', helpers.ensureAdmin, function(req, res, next) {
  deleteQuestion();
});

router.get('/:qid/answer/:aid/delete', helpers.ensureAdmin, function(req, res, next) {
  deleteAnswer();
});

router.get('/:id/flag', helpers.ensureAuthenticated, function(req, res, next) {
  flagQuestion.flag();
});

router.get('/:id/unflag', helpers.ensureAdmin, function(req, res, next) {
  flagQuestion.unflag();
});

router.get('/:qid/answer/:aid/flag', function(req, res, next) {
  flagAnswer.flag();
});

router.get('/:qid/answer/:aid/unflag', helpers.ensureAdmin, function(req, res, next) {
  flagAnswer.flag();
});

router.post('/:id/voteup', helpers.ensureAuthenticated, function(req, res, next) {
  voteQuestion.voteUp();
});

router.post('/questions/:id/votedown', helpers.ensureAuthenticated, function(req, res, next) {
  voteQuestion.voteDown();
});

router.post('/answers/:id/voteup', helpers.ensureAuthenticated, function(req, res, next) {
  voteAnswer.voteUp();
});

router.post('/answers/:id/votedown', helpers.ensureAuthenticated, function(req, res, next) {
  voteAnswer.voteDown();
});

module.exports = router;
