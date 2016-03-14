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
  if (qId === 'new') {
    res.render('newQuestion', {title: 'Slack Overflow - Post a Question'});
  } else if (qId !== 'new') {
    knex('questions').where('id', qId).then(function(qData) {
      console.log(qData);
      res.render('question', {title: 'Slack Overflow - ' + qData.title, question: qData[0]});
    });
  }
});


router.post('/questions/add', function(req, res, next) {
  // store form info in a variable
  var qData = req.body;
  // do table insert
  knex('questions').insert({title: qData.title,
    body: qData.body,
    group_id: qData.group_id,
    user_id: qData.user_id,
    score: 0,
    flag_status:false,
    assignment_id: qData.assignment_id}, 'id').then(function(data) {
      //render question page
      res.redirect('/questions/' + data[0]);
    });
});



module.exports = router;
