var express = require('express');
var router = express.Router();
var knex = require('../../../db/knex');
var request = require('request-promise');
var Promise = require('bluebird');

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
    messageArray.shift();
    var title = messageArray[0];
    var body = messageArray[1];
    var tagList = messageArray[2];
    tagList = tagList.replace(/ /g, '');
    tagList = tagList.toLowerCase();
    var tagArray = tagList.split(',');
    var tagIds = [];
    var questionId;

    // look up group and store group_id
    knex('groups').select('id').where('slack_channel', group)
      .then(function(data) {
        groupId = data[0].id;
      })
      .then(function() {
        // look up user and store id
        return knex('users').select('id').where('slack_id', userSlackId)
          .then(function(data) {
            userId = data[0].id;
          });
      })
      .then(function() {
        // insert question data into questions table, get question's ID back
        return knex('questions').insert({
          title: title,
          body: body,
          group_id: groupId,
          user_id: userId,
          score: 0,
          flag_status: false
        }, 'id');
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
          return knex('tags').select('id').where('tag_name', el)
          .then(function(data) {
            console.log('search returns', data);
            // if not, insert it and then put id into tagIds array
            if(data[0] === undefined) {
              console.log('into the undefined part of loop');
              return knex('tags').insert({
                tag_name: el
              }, 'id').then(function(id) {
                return tagIds.push(id);
              });
            // if so, put the id into the array.
            } else {
              console.log('into tag exists part of loop');
              return tagIds.push(data[0].id);
            }
          });
        });
        return Promise.all(promisesArray);
      })
      .then(function() {
        // insert question/tag relationships into question_tags table
        var promisesArray = tagIds.map(function(el, ind, arr) {
          return knex('question_tags').insert({
            question_id: questionId,
            tag_id: el
          });
        });
        return Promise.all(promisesArray);
      })
      .then(function(data) {
        //respond with text and question id
        res.status(200).header('Content-Type', 'application/json').send({
          'response_type': 'in_channel',
          'text': 'Thanks for posting a question to Slack Overflow ' + userSlackName + '! You can view this question at https://slackoverflowapp.herokuapp.com/questions/' + questionId + '. To respond to this question, type /sflowa #title #body #' + questionId
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
  messageArray.shift();
  var title = messageArray[0];
  var body = messageArray[1];
  var qId = messageArray[2];
  var channelArray = [];
  var userArray = [];

  // look up user and store id
  knex('users').select('id').where('slack_id', userSlackId)
    .then(function(data) {
      userId = data[0];
    })
    .then(function() {
      return knex('answers').insert({
        title: title,
        body: body,
        question_id: qId,
        user_id: userId.id,
        score: 0,
        flag_status: false
      });
    })
    .then(function() {
      // look through subscriptions table for this question id
      // look up slack user_ids for all users associated with this question
      return knex('users').select('slack_id', 'slack_access_token')
        .join('subscriptions', {
          'users.id': 'subscriptions.user_id'
        })
        .where('subscriptions.question_id', req.params.id);
    })
    .then(function(users) {
      console.log('users', users);
      // open a channel with all subscribed users
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
