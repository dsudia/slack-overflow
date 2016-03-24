var express = require('express');
var router = express.Router();
var passport = require('../lib/passport');


router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


router.get('/slack', passport.authenticate('slack'));

router.get('/slack/callback',
  passport.authenticate('slack', { failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });



router.get('/logout', function(req, res, next) {
  console.log('hi');
  //req.session = null;
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
 // res.redirect('/');
});

module.exports = router;
