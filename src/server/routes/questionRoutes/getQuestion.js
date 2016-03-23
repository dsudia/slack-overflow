var knex = require('../../../../db/knex');
var quesQueries = require('../../../../queries/questions');
var tagQueries = require('../../../../queries/tags');
var answerQueries = require('../../../../queries/answers');

module.exports = function(req, res, next) {
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
    return quesQueries.getQuestionAndUser(qId)
    .then(function(data) {
        questionData = data;
      }).then(function() {
        return tagQueries.getQuestionTags(qId);
      }).then(function(tagData) {
        tagData.forEach(function(el, ind, arr) {
          return tagList.push(el.tag_name);
        });
      }).then(function() {
        return answerQueries.getAnswers(qId);
      }).then(function(answers) {
        console.log(answers);
        answers.forEach(function(el, ind, arr) {
          return answerList.push(el);
        });
      }).then(function() {
        res.render('question', {
          title: 'Slack Overflow - ' + qId,
          question: questionData[0],
          tags: tagList,
          answers: answerList,
          user: req.user
        });
      });
  }
};
