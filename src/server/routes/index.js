var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../../../db/knex');
var quesQueries = require("../../../queries/questions");
var answerQueries = require('../../../queries/answers');
var tagQueries = require('../../../queries/tags');
var helpers = require('../lib/helpers');
var Promise = require('bluebird');


router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  res.render('index', {
    title: 'Slack Overflow',
    user: req.user,
    slack: req.user.slack_id,
  });
});


module.exports = router;
