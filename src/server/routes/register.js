var express = require('express');
var router = express.Router();
var helpers = require('../lib/helpers');
var knex = require('../../../db/knex');

router.get('/', helpers.loginRedirect, function(req, res, next) {
  res.render('register', {
    user: req.user,
    message: req.flash('danger')
  });
});

router.post('/', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var username = req.body.username;
  // check if email is unique
  knex('users').where('email', email)
    .then(function(data) {
      // if email is in the database send an error
      if (data.length) {
        req.flash('danger', 'Email already exists.!');
        return res.redirect('/register');
      } else {
        // hash and salt the password
        var hashedPassword = helpers.hashing(password);
        // if email is not in the database insert it
        knex('users').insert({
            email: email,
            password: hashedPassword,
            first_name: first_name,
            last_name: last_name,
            username: username,
            auth_id: 3
          })
          .then(function(data) {
            req.flash('message', {
              status: 'success',
              message: 'Welcome!'
            });
            return res.redirect('/login');
          })
          .catch(function(err) {
            return res.send(err);
          });
      }
    })
    .catch(function(err) {
      return next(err);
    });
});

module.exports = router;
