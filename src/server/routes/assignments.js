var express = require("express");
var router = express.Router();
var queries = require("../../../queries");
var knex = require('../../../db/knex.js');
var passport = require('passport');
var helpers = require('../lib/helpers');


router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  var weekID = req.query.week;
  var groupID = req.query.group;
  queries.getAssignments(groupID, weekID).then(function(assignments){
    console.log(assignments);
    res.render('assignments', {week: weekID,
                              groupID: groupID,
                              assignments: assignments})
  })
  .catch(function(err) {
    console.log(err);
  });
    //res.render('assignments', { title: 'Slack Overflow',
          //                user: req.user, questions: data, slack: req.user.slack_id});
    // need to find a way to pull tags for every question - talk to an instructor
    // need to find a way to count number of answers for each question - ^^
});

module.exports = router;
