var knex = require('../../../../db/knex');
var Promise = require('bluebird');
var quesQueries = require('../../../../queries/questions');
var tagQueries = require('../../../../queries/tags');

module.exports = function(req, res, next) {
  // store form info in a variable
  console.log(req.body);
  var user = req.user;
  var qData = req.body;
  var tagList = req.body.tags;
  tagList = tagList.replace(/ /g, '');
  tagList = tagList.toLowerCase();
  var tagArray = tagList.split(',');
  var tagIds = [];
  var questionId;
  var body = qData.body;

  // insert question data into questions table, get question's ID back
  return quesQueries.addQuestion(
      body,
      qData.group_id,
      req.user.id,
      0,
      false,
      qData.assignment_id)
  .then(function(id) {
    // store question ID in variable for later usage
    questionId = id;
    questionId = Number(questionId);
  }).then(function() {
    // put tags into tags table and store ids in an array
    var promisesArray = tagArray.map(function(el, ind, arr) {
      // see if tag is already in table
      return tagQueries.searchTags(el)
      .then(function(data) {
        // if not, insert it and then put id into tagIds array
        if(data[0] === undefined) {
          return tagQueries.insertTagsToTags(el)
          .then(function(id) {
            return tagIds.push(id);
          });
        // if so, put the id into the array.
      } else {
        return tagIds.push(data[0].id);
      }
      });
    });
    return Promise.all(promisesArray);
  }).then(function() {
    // insert question/tag relationships into question_tags table
    var promisesArray = tagIds.map(function(el, ind, arr) {
      return tagQueries.insertTagsToQT(questionId, el);
    });
    return Promise.all(promisesArray);
  }).then(function(data) {
    //render question page
    res.redirect('/questions/' + questionId);
  });
};
