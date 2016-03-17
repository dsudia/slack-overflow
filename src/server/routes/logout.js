var express = require('express');
var router = express.Router();
var helpers = require('../lib/helpers');

router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
