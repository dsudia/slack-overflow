var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../../../db/knex');
var passport = require('../lib/auth');
var bcrypt = require('bcrypt');
var helpers = require('../lib/helpers');
var Promise = require('bluebird');
var alchemy = require('../lib/alchemy');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Slack Overflow' });
});

router.get('/questions/:id', function(req, res, next) {
  var qId = req.params.id;
  var questionData;
  if (qId === 'new') {
    res.render('newQuestion', {title: 'Slack Overflow - Post a Question'});
  } else if (qId !== 'new') {
    knex('questions').select('questions.title, questions.body, tags.tag_name').where('id', qId)
    .join('question_tags', {'questions.id': 'question_tags.question_id'})
    .join('tags', {'tags.id': 'question_tags.tag_id'}).then(function(qData) {
      questionData = qData[0];
    }).then(function() {
      res.render('question', {title: 'Slack Overflow - ' + qData.title, question: questionData});
    });
  }
});

router.post('/questions/add', function(req, res, next) {
  // store form info in a variable
  var qData = req.body;
  var bodyText = (qData.body).toString();
  var analysisText = (bodyText);
  var tags = [];
  var tagIds = [];
  var questionID;

  //do alchemy analysis on text
  var promise = new Promise(function(resolve, reject) {
    alchemy(analysisText, function(error, result) {
      if (error) {
        reject('Alchemy did not run correctly');
      } else {
        resolve(result);
      }
    });
  });

  promise.then(function(data) {
    console.log(data);
    var keywordArr = data.keywords;
    console.log(keywordArr);
    // push each keyword to an array
    return keywordArr.forEach(function(el, ind, arr) {
      tags.push(el.text);
      console.log(tags);
    });
  }).then(function() {
    // insert those keywords into the tags table
    tags.forEach(function(el, ind, arr) {
      knex('tags').insert({tag_name: el}, 'id').then(function(id) {
        tagIds.push(id);
      });
    });
  }).then(function() {
    // insert question data into questions table, get question's ID back
    knex('questions').insert({title: qData.title,
      body: qData.body,
      group_id: qData.group_id,
      user_id: qData.user_id,
      score: 0,
      flag_status:false,
      assignment_id: qData.assignment_id}, 'id');
  }).then(function(id) {
    questionID = id;
  }).then(function() {
    // insert question/tag relationships into appropriate table
    tag_ids.forEach(function(el, ind, arr) {
      knex('question_tags').insert({
        question_id: questionId,
        tag_id: el});
    });
  })
  // do table insert
    .then(function(data) {
      //render question page
      res.redirect('/questions/' + questionID);
    });
});



module.exports = router;
