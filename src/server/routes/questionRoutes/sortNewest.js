var knex = require('../../../../db/knex');
var quesQueries = require('../../../../queries/questions');
var answerQueries = require('../../../../queries/answers');
var tagQueries = require('../../../../queries/tags');

module.exports = function(req, res, next) {
  var tableData = {
    questionData: [],
    answerCountArray: [],
    tagArray: []
  };
  return quesQueries.getAllQuestionsAndUsers()
    .then(function(data) {
      return data.forEach(function(el, ind, arr) {
        return tableData.questionData.push(el);
      });
    })
    .then(function() {
      return answerQueries.getAnswerCount();
    })
    .then(function(data) {
      return data.forEach(function(el, ind, arr) {
        return tableData.answerCountArray.push(el);
      });
    })
    .then(function() {
      return tagQueries.getAllQuestionTags();
    })
    .then(function(data) {
      return data.forEach(function(el, ind, arr) {
        return tableData.tagArray.push(el);
      });
    })
    .then(function() {
      res.status(200).send(tableData);
    });
};
