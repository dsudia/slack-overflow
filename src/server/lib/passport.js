var passport = require('passport');
var knex = require('../../../db/knex');
var helpers = require('./helpers');
var GitHubStrategy = require('passport-github').Strategy;
var SlackStrategy = require('passport-slack').Strategy;
if ( !process.env.NODE_ENV ) { require('dotenv').config(); }

/// *** passport middleware ***//
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/github/callback",
    redirect_uri: process.env.HOST
  }, function(accessToken, refreshToken, profile, done) {
    console.log('email ', profile.email);
    return knex('users')
      .where('email', profile.email)
      .then(function (user) {
        console.log('user ', user);

        if (user[0] !== undefined) {
          var names = profile.displayName.split(' ');
          var firstname = names[0];
          var lastname = names[names.length-1];

          return knex('users').insert({
            github_id: profile.id,
            github_login: profile.username,
            github_avatar: profile.photos[0].value,
            first_name: firstname,
            last_name: lastname}, 'id').then(function(id){
              return done(null, id);
          });
        }
      }), function(err, user) {
        return done(err, user);
      };
}));

passport.use(new SlackStrategy({
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/slack/callback",
    scope: 'users:read im:write chat:write:bot'
  },
  function(accessToken, refreshToken, profile, done) {
    //does the email exist?
    var slackEmail = profile._json.info.user.profile.email;
    var slackId = profile._json.info.user.id;
     knex('users')
      .where({ email: slackEmail })
      .andWhere({ slack_id: slackId }) // change this line to fix it for emails
      .first()
      .then(function(hasSlackId) {
        if(!hasSlackId) {
          return knex('users')
          .where({email: slackEmail})
            .update({
              slack_id: slackId,
              slack_access_token: accessToken
            }, 'id').then(function(id){
              return done(null, id[0]);
            });
          }else {
            return done(null, hasSlackId.id);
          }
      });
}));



// *** configure passport *** //
passport.serializeUser(function(userID, done) {
  done(null, userID);
});

passport.deserializeUser(function(userID, done) {
if (userID) {
    knex('users').where('id', userID).select()
      .then(function (user) {
        if ( !user ) {
          done();
        } else {
          done(null, user[0]);
        }
      })
      .catch(function (err) {
        done(err, null);
      });
  } else {
    done();
  }
});


module.exports = passport;
