var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../../../db/knex');
var passport = require('../lib/auth');
var bcrypt = require('bcrypt');
var helpers = require('../lib/helpers');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Slack Overflow' });
});

router.get('/questions/:id', function(req, res, next) {
  var qId = req.params.id;
  var questionData;
  var tagList = [];
  if (qId === 'new') {
    res.render('newQuestion', {title: 'Slack Overflow - Post a Question'});
  } else if (qId !== 'new') {
    return knex('questions').where('id', qId).then(function(data) {
      questionData = data;
    }).then(function() {
      return knex('tags').select('tag_name').where('questions.id', qId)
      .join('question_tags', {'tags.id': 'question_tags.tag_id'})
      .join('questions', {'questions.id': 'question_tags.question_id'});
    }).then(function(tagData) {
      tagData.forEach(function(el, ind, arr) {
        return tagList.push(el.tag_name);
      });
    }).then(function() {
      console.log(tagList);
      console.log(questionData);
      res.render('question', {title: 'Slack Overflow - ' + questionData.title, question: questionData[0], tags: tagList});
    });
  }
});

router.post('/questions/add', function(req, res, next) {
  // store form info in a variable
  var qData = req.body;
  var tagList = req.body.tags;
  tagList = tagList.replace(/ /g, '');
  var tagArray = tagList.split(',');
  var tagIds = [];
  var questionID;

  // insert question data into questions table, get question's ID back
  knex('questions').insert({title: qData.title,
    body: qData.body,
    group_id: qData.group_id,
    user_id: qData.user_id,
    score: 0,
    flag_status:false,
    assignment_id: qData.assignment_id}, 'id').then(function(id) {
    // store question ID in variable for later usage
    questionID = id;
  }).then(function() {
    // put tags into tags table and store ids in an array
    tagArray.forEach(function(el, ind, arr) {
      return knex('tags').insert({tag_name: el}, 'id').then(function(id) {
        tagIds.push(id);
      });
    });
  }).then(function() {
    // insert question/tag relationships into question_tags table
    tagIds.forEach(function(el, ind, arr) {
      knex('question_tags').insert({
        question_id: questionId,
        tag_id: el});
    });
  }).then(function(data) {
      //render question page
      res.redirect('/questions/' + questionID);
  });
});



module.exports = router;
