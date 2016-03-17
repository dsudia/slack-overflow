var express = require('express');
var router = express.Router();
var helpers = require('../lib/helpers');

router.get('/', helpers.loginRedirect, function(req, res, next) {
  res.render('login', {
    user: req.user,
    message: req.flash('danger')
  });
});

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, userId) {
    if (err) {
      return next(err);
    } else {
      req.logIn(userId, function(err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  })(req, res, next);
});

module.exports = router;
