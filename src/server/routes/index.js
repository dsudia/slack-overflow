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

router.get('/questions/1', function(req, res, next) {
  res.render('question', {title: 'Slack Overflow'});
});

router.get('/questions/new', function(req, res, next) {
  res.render('newQuestion', {title: 'Slack Overflow - Post a Question'});
});

router.post('/questions/new', function(req, res, next) {
  // store form info in a variable
  var qData = req.body;
  // do table insert
  knex('questions').insert({title: qData.title,
    body: qData.body,
    group_id: qData.group_id,
    user_id: qData.user_id,
    score: 0,
    flag_status:false,
    assignment_id: qData.assignment_id}).then(function() {
      //retrieve id of new question
      knex('questions').select('id').where('body', qData.body);
    }).then(function(data) {
      //render question page
      res.render('/questions/' + data[0]);
    });
});



module.exports = router;
