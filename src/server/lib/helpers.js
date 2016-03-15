var bcrypt = require('bcrypt');
var Promise = require('bluebird');
Promise.promisifyAll(bcrypt);


function ensureAuthenticated(req, res, next) {
  // check if user is authenticated
  if(req.user) {
    // if so -> call next()
    return next();
  } else {
    // if not -> redirect to login
    return res.redirect('/login');
  }
}

function ensureAdmin(req, res, next) {
    // check if user is admin
    if(req.user.auth_id === 1 || req.user.auth_id === 2) {
      // if so call next()
      return next();
    } else {
      // if not, redirect to login
      req.flash('error', 'You are not logged in as an admin.');
      return res.status(403).redirect('/login');
    }
  }


function loginRedirect(req, res, next) {
  // check if user is authenticated
  if(req.user) {
    // if so -> redirect to main route
    return res.redirect('/');
  } else {
    // if not -> call next()
    return next();
  }
}


function hashing(password) {
  return bcrypt.hashSync(password, 10);
  // Add promises!!!
  // var newPassword;
  // bcrypt.hash(password, 10, function(err, hash) {
  //   newPassword = hash;
  // });
  // return newPassword;
}


function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}


module.exports = {
  ensureAdmin: ensureAdmin,
  ensureAuthenticated: ensureAuthenticated,
  loginRedirect: loginRedirect,
  hashing: hashing,
  comparePassword: comparePassword
};
