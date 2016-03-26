var express = require("express");
var router = express.Router();
var knex = require('../../../db/knex');

router.get('/', function(req, res, next) {
  res.render('staffPortal');
});


// User function routes
router.get('/searchUsers', function(req, res, next) {
  res.render('staffFunctions/searchUsers');
});

router.get('/searchUsers/search', function(req, res, next) {
  var searchString = req.query.search;
  return knex('users').select('id', 'first_name', 'last_name', 'email', 'auth_id')
    .where('first_name', 'like', '%' + searchString + '%')
    .orWhere('last_name', 'like', '%' + searchString + '%')
    .then(function(data) {
      res.status(200).send(data);
    })
    .catch(function(err) {
      console.log(err);
    });
});

router.post('/delUser/:id', function(req, res, next) {
  return knex('users').where('id', req.params.id).del()
  .then(function() {
    res.redirect('/staff');
  });
});

router.get('/updateUser/:id', function(req, res, next) {
  return knex('users').where('id', req.params.id)
  .then(function(user) {
    res.render('staffFunctions/updateUser', {user: user[0]});
  });
});

router.post('/updateUser/:id', function(req, res, next) {
  return knex('users').where('id', req.params.id).update
  ({'first_name': req.body.first_name,
  'last_name': req.body.last_name,
  'email': req.body.email,
  'auth_id': req.body.auth_id
  })
  .then(function() {
    res.redirect('/staff');
  });
});

router.get('/addUser', function(req, res, next) {
  res.render('staffFunctions/addUser');
});

router.post('/addUser', function(req, res, next) {
  return knex('users').insert
  ({'email': req.body.email,
  'auth_id': req.body.auth_id
  })
  .then(function() {
    res.redirect('/staff');
  });
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
