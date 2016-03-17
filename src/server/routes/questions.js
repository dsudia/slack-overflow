var express = require("express");
var router = express.Router();
var queries = require("../../../queries");
var knex = require('../../../db/knex.js');
var passport = require('passport');
var helpers = require('../lib/helpers');



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
module.exports = router;
