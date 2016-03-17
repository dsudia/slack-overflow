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
var subscribe = require('./questionRoutes/subscribe');
var getQuestion = require('./questionRoutes/getQuestion');


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


router.get('/questions/:id', helpers.ensureAuthenticated, function(req, res, next) {
  getQuestion();
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

router.post('/:id/votedown', helpers.ensureAuthenticated, function(req, res, next) {
  voteQuestion.voteDown();
});

router.post('/subscribe/:id', helpers.ensureAuthenticated, function(req, res, next) {
  subscribe.subscribe();
});

router.post('/unsubscribe/:id', helpers.ensureAuthenticated, function(req, res, next) {
  subscribe.unsubscribe();
});

module.exports = router;
