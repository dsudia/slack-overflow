router.get('/login', helpers.loginRedirect, function(req, res, next) {
  res.render('login', {
    user: req.user,
    message: req.flash('danger')
  });
});

router.post('/login', function(req, res, next) {
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
