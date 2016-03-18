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
                              assignments: assignments});
  })
  .catch(function(err) {
    console.log(err);
  });
});

module.exports = router;
