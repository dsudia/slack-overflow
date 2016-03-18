var express = require('express');
var router = express.Router();
var helpers = require('../lib/helpers');

var voteAnswer = require('./answerRoutes/voteAnswer');

router.post('/:id/voteup', helpers.ensureAuthenticated, function(req, res, next) {
  voteAnswer.voteUp(req, res, next);
});

router.post('/:id/votedown', helpers.ensureAuthenticated, function(req, res, next) {
  voteAnswer.voteDown(req, res, next);
});

module.exports = router;
