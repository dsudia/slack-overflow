var express = require('express');
var router = express.Router();
var helpers = require('../lib/helpers');

router.get('/', helpers.loginRedirect, function(req, res, next) {
  res.render('login', {
    user: req.user,
    message: req.flash('danger')
  });
});

module.exports = router;
