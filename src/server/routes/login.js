var express = require('express');
var router = express.Router();
var helpers = require('../lib/helpers');

router.get('/', function(req, res, next) {
  res.render('login', {
    user: req.user,
    message: req.flash('danger')
  });
});

module.exports = router;
