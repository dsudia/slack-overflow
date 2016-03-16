var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  console.log(req.query);
    res.render('index', { title: 'Slack Overflow',
                          user: req.user, questions: data, slack: req.user.slack_id});
    // need to find a way to pull tags for every question - talk to an instructor
    // need to find a way to count number of answers for each question - ^^^
  });
});