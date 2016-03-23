var knex = require('../../../../db/knex');
var answerQueries = require('../../../../queries/answers');
var userQueries = require('../../../../queries/users');
var request = require('request-promise');

module.exports = function(req, res, next) {
  var aData = req.body;
  userId = req.user.id;
  var body = aData.body;
  var channelArray = [];
  var userArray = [];

  return answerQueries.postAnswer(
     aData.body,
     req.params.id,
     userId,
     0,
     false
    )
    .then(function() {
      // look through subscriptions table for this question id
      // look up slack user_ids for all users associated with this question
      userQueries.getSlackInfo(req.params.id);
    })
    .then(function(users) {
      console.log('users', users);
      // if there are subscribed users, open a channel with all subscribed users
      if (users[0] !== undefined) {
        for (i = 0; i < users.length; i++) {
          return request('https://slack.com/api/im.open?token=' + users[i].slack_access_token + '&user=' + users[i].slack_id, function(err, res, body) {})
            .then(function(response) {
              console.log('response', response);
              var resBody = JSON.parse(response);
              return channelArray.push({
                channel: resBody.channel.id,
                userToken: users[i].slack_access_token
              });
            });
        }
      }

    })
    .then(function() {
      // post a message in each channel
      if (channelArray[0] !== undefined) {
        for (i = 0; i < channelArray.length; i++) {
          return request('https://slack.com/api/chat.postMessage?token=' + channelArray[i].userToken + '&channel=' + channelArray[i].channel + '&text=Question%20' + req.params.id + '%20was%20just%20answered!',
            function(err, res, body) {
              console.log('posted a message to channel: ', channelArray[0]);
            });
        }
      }

    })
    .then(function() {
      res.redirect('/questions/' + req.params.id);
    });
};
