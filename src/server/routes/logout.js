router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  req.logout();
  res.redirect('/');
});
