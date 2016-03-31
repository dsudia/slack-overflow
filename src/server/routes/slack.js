var express = require('express');
var router = express.Router();
var knex = require('../../../db/knex');
var request = require('request-promise');
var Promise = require('bluebird');
var quesQueries = require('../../../queries/questions');
var answerQueries = require('../../../queries/answers');
var tagQueries = require('../../../queries/tags');
var userQueries = require('../../../queries/users');
var groupQueries = require('../../../queries/groups');

router.post('/question', function(req, res, next) {
  //parse object and store user_id, token, usernname, channel_id, text in variables
  var token = req.body.token;
  var userSlackId = req.body.user_id;
  var userSlackName = req.body.user_name;
  var message = req.body.text;
  var group = req.body.channel_id;
  var userId;
  var groupId;

  // confirm token
  if (token !== process.env.SLACK_Q_TOKEN) {
    res.status(401).send('Invalid token');
  } else {
    // parse text into title, body and question.id and store in variables
    var messageArray = message.split('#');
    var body = messageArray[0];
    var tagList = messageArray[1];
    tagList = tagList.replace(/ /g, '');
    tagList = tagList.toLowerCase();
    var tagArray = tagList.split(',');
    var tagIds = [];
    var questionId;

    // look up group and store group_id
    return groupQueries.getGroupBySlackChannel(group)
      .then(function(data) {
        groupId = data[0].id;
      })
      .then(function() {
        // look up user and store id
        return userQueries.getUserBySlackId(userSlackId)
          .then(function(data) {
            userId = data[0].id;
          });
      })
      .then(function() {
        // insert question data into questions table, get question's ID back
        return quesQueries.addQuestion(
            body,
            groupId,
            userId,
            0,
            false,
            null);
      })
      .then(function(id) {
        // store question ID in variable for later usage
        questionId = id;
        questionId = Number(questionId);
      })
      .then(function() {
        // put tags into tags table and store ids in an array
        var promisesArray = tagArray.map(function(el, ind, arr) {
          // see if tag is already in table
          return tagQueries.searchTags(el)
          .then(function(data) {
            // if not, insert it and then put id into tagIds array
            if(data[0] === undefined) {
              return tagQueries.insertTagsToTags()
              .then(function(id) {
                id = Number(id);
                return tagIds.push(id);
              });
            // if so, put the id into the array.
            } else {
              return tagIds.push(data[0].id);
            }
          });
        });
        return Promise.all(promisesArray);
      })
      .then(function() {
        // insert question/tag relationships into question_tags table
        var promisesArray = tagIds.map(function(el, ind, arr) {
          return tagQueries.insertTagsToQT(questionId, el);
        });
        return Promise.all(promisesArray);
      })
      .then(function(data) {
        //respond with text and question id
        res.status(200).header('Content-Type', 'application/json').send({
          'response_type': 'in_channel',
          'text': 'Thanks for posting a question to Slack Overflow ' + userSlackName + '!\n You can view this question at https://slackoverflowapp.herokuapp.com/questions/' + questionId + '.\n To respond to this question, type /ofa bodyOfYourAnswer #' + questionId
        });
      });
  }
});

router.post('/answer', function(req, res, next) {
  //parse object and store user_id, token, usernname, channel_id, text in variables
  var token = req.body.token;
  var userSlackId = req.body.user_id;
  var userSlackName = req.body.user_name;
  var message = req.body.text;
  var group = req.body.channel_id;
  var userId;

  // confirm token
  if (token !== process.env.SLACK_A_TOKEN) {
    res.status(401).send('Invalid token');
  }

  // parse text into title, body and question.id and store in variables
  var messageArray = message.split('#');
  var body = messageArray[0];
  var qId = messageArray[1];
  var channelArray = [];
  var userArray = [];

  // look up user and store id
  return userQueries.getUserBySlackId(userSlackId)
    .then(function(data) {
      userId = data[0].id;
    })
    .then(function() {
      return answerQueries.postAnswer(
         body,
         qId,
         userId,
         0,
         false
       );
    })
    .then(function() {
      // look through subscriptions table for this question id
      // look up slack user_ids for all users associated with this question
      userQueries.getSlackInfo(userId);
    })
    .then(function(users) {
      // open a channel with all subscribed users
      if (users[0] !== undefined) {
        for (i = 0; i < users.length; i++) {
          return request('https://slack.com/api/im.open?token=' + users[i].slack_access_token + '&user=' + users[i].slack_id, function(err, res, body) {})
            .then(function(response) {
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
    // post answer
    .then(function(data) {
      //respond with text and question id
      res.status(200).header('Content-Type', 'application/json').send({
        'response_type': 'in_channel',
        'text': 'Thanks for posting an answer to question ' + qId + ' to Slack Overflow ' + userSlackName + '!'
      });
    });
});

module.exports = router;
