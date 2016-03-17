var knex = require('../../../../db/knex');
var Promise = require('bluebird');

module.exports = function(req, res, next) {
  // store form info in a variable
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
  return knex('questions').insert({
    title: qData.title,
    body: body,
    group_id: qData.group_id,
    user_id: req.user.id,
    score: 0,
    flag_status: false,
    assignment_id: qData.assignment_id
  }, 'id').then(function(id) {
    // store question ID in variable for later usage
    questionId = id;
    questionId = Number(questionId);
  }).then(function() {
    // put tags into tags table and store ids in an array
    var promisesArray = tagArray.map(function(el, ind, arr) {
      // see if tag is already in table
      return knex('tags').select('id').where('tag_name', el)
      .then(function(data) {
        // if not, insert it and then put id into tagIds array
        if(data[0] === undefined) {
          return knex('tags').insert({
            tag_name: el
          }, 'id').then(function(id) {
            return tagIds.push(id);
          });
        // if so, put the id into the array.
      } else {
        console.log('into tag exists part of loop');
        return tagIds.push(data[0].id);
      }
      });
    });
    return Promise.all(promisesArray);
  }).then(function() {
    // insert question/tag relationships into question_tags table
    var promisesArray = tagIds.map(function(el, ind, arr) {
      return knex('question_tags').insert({
        question_id: questionId,
        tag_id: el
      });
    });
    return Promise.all(promisesArray);
  }).then(function(data) {
    //render question page
    res.redirect('/questions/' + questionId);
  });
};
