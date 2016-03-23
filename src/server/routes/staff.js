var express = require("express");
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('staffPortal');
});


// User function routes
router.get('/searchUsers', function(req, res, next) {
  res.render('staffFunctions/searchUsers');
});

router.post('/delUser', function(req, res, next) {

});

router.get('/updateUser', function(req, res, next) {
  res.render('staffFunctions/updateUser');
});

router.post('/updateUser', function(req, res, next) {

});

router.get('/addUser', function(req, res, next) {
  res.render('staffFunctions/addUser');
});

router.post('/addUser', function(req, res, next) {

});


// Cohort function routes
router.get('/searchCohorts', function(req, res, next) {
  res.render('staffFunctions/searchCohorts');
});

router.post('/delCohort', function(req, res, next) {

});

router.get('/addCohort', function(req, res, next) {
  res.render('staffFunctions/addCohort');
});

router.post('/addCohort', function(req, res, next) {

});


// Assignment function routes
router.get('/searchAssignments', function(req, res, next) {
  res.render('staffFunctions/searchAssignments');
});

router.post('/delAssignment', function(req, res, next) {

});

router.get('/addAssignment', function(req, res, next) {
  res.render('staffFunctions/addAssignment');
});

router.post('/addAssignment', function(req, res, next) {

});

router.post('schedAssignment', function(req, res, next) {

});

module.exports = router;
