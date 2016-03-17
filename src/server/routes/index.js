var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../../../db/knex');
var passport = require('../lib/auth');
var queries = require("../../../queries");
var bcrypt = require('bcrypt');
var helpers = require('../lib/helpers');
var markdown = require('markdown').markdown;
var request = require('request-promise');


router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  var questionData;
  var answerCountArray;
  knex('questions').select('questions.title', 'questions.id', 'questions.body', 'questions.score', 'users.username')
  .join('users', {'questions.user_id': 'users.id'})
  .then(function(data) {
    questionData = data;
  })
  .then(function() {
    return knex('answers').select('question_id').count().groupBy('question_id');
  })
  .then(function(data) {
    console.log('answer counts', data);
    answerCountArray = data;
  })
  .then(function() {
    console.log(answerCountArray);
    res.render('index', { title: 'Slack Overflow',
                          user: req.user,
                          questions: questionData,
                          slack: req.user.slack_id,
                          answerCount: answerCountArray});
    // need to find a way to pull tags for every question - talk to an instructor
    // need to find a way to count number of answers for each question - ^^^
    // need to show author's name
  });
});






router.get('/login', helpers.loginRedirect, function(req, res, next) {
  res.render('login', {user: req.user, message: req.flash('danger')});
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


router.get('/register', helpers.loginRedirect, function(req, res, next) {
  res.render('register', {user: req.user, message: req.flash('danger')});
});


router.post('/register', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var username = req.body.username;
  // check if email is unique
  knex('users').where('email', email)
    .then(function(data){
      // if email is in the database send an error
      if(data.length) {
          req.flash('danger', 'Email already exists.!');
          return res.redirect('/register');
      } else {
        // hash and salt the password
        var hashedPassword = helpers.hashing(password);
        // if email is not in the database insert it
        knex('users').insert({
          email: email,
          password: hashedPassword,
          first_name: first_name,
          last_name: last_name,
          username: username,
          auth_id: 3
        })
        .then(function(data) {
          req.flash('message', {
            status: 'success',
            message: 'Welcome!'
          });
          return res.redirect('/login');
        })
        .catch(function(err) {
          return res.send(err);
        });
      }
    })
    .catch(function(err){
      return next(err);
    });
});


router.get('/logout', helpers.ensureAuthenticated, function(req, res, next) {
  req.logout();
  res.redirect('/');
});






router.get('/questions/:id', helpers.ensureAuthenticated, function(req, res, next) {
  // need to show author's name
  var userId = req.user.id;
  var qId = req.params.id;
  var questionData;
  var tagList = [];
  var answerList = [];
  if (qId === 'new') {
    return knex('groups')
    .then(function(cohorts){
          res.render('newQuestion', {user: req.user,
                                    cohorts: cohorts,
                                    title: 'Slack Overflow - Post a Question'});
    });
  } else if (qId !== 'new') {
    return knex('questions').select('questions.id', 'questions.title', 'questions.body', 'questions.score', 'users.username')
    .join('users', {'questions.user_id': 'users.id'})
    .where({'questions.id': qId}).then(function(data) {
      questionData = data;
    }).then(function() {
      return knex('tags').select('tag_name').where('questions.id', qId)
      .join('question_tags', {'tags.id': 'question_tags.tag_id'})
      .join('questions', {'questions.id': 'question_tags.question_id'});
    }).then(function(tagData) {
      tagData.forEach(function(el, ind, arr) {
        return tagList.push(el.tag_name);
      });
    }).then(function() {
      return knex('answers').select('answers.title', 'answers.body', 'users.username')
      .join('users', {'answers.user_id': 'users.id'})
      .where('question_id', qId);
    }).then(function(answers) {
      console.log(answers);
      answers.forEach(function(el, ind, arr) {
        return answerList.push(el);
      });
    }).then(function() {
      res.render('question', {title: 'Slack Overflow - ' + questionData.title,
        question: questionData[0],
        tags: tagList,
        answers: answerList,
        user: req.user});
    });
  }
});


router.post('/questions/add', helpers.ensureAuthenticated, function(req, res, next) {
  // store form info in a variable
  var user = req.user;
  var qData = req.body;
  console.log(qData.user_id);
  var tagList = req.body.tags;
  tagList = tagList.replace(/ /g, '');
  tagList = tagList.toLowerCase();
  var tagArray = tagList.split(',');
  var tagIds = [];
  var questionID;
  var body = markdown.toHTML(qData.body);

  // insert question data into questions table, get question's ID back
  knex('questions').insert({title: qData.title,
    body: body,
    group_id: qData.group_id,
    user_id: req.user.id,
    score: 0,
    flag_status:false,
    assignment_id: qData.assignment_id}, 'id').then(function(id) {
    // store question ID in variable for later usage
    questionID = id;
  }).then(function() {
    // put tags into tags table and store ids in an array
    tagArray.forEach(function(el, ind, arr) {
      return knex('tags').insert({tag_name: el}, 'id').then(function(id) {
        tagIds.push(id);
      });
    });
  }).then(function() {
    // insert question/tag relationships into question_tags table
    tagIds.forEach(function(el, ind, arr) {
      knex('question_tags').insert({
        question_id: questionId,
        tag_id: el});
    });
  }).then(function(data) {
      //render question page
      res.redirect('/questions/' + questionID);
  });
});

router.post('/slack/question', function(req, res, next) {
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
    body = markdown.toHTML(body);
    var tagList = messageArray[2];
    tagList = tagList.replace(/ /g, '');
    tagList = tagList.toLowerCase();
    var tagArray = tagList.split(',');
    var tagIds = [];
    var questionID;

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
      return knex('questions').insert({title: title,
        body: body,
        group_id: groupId,
        user_id: userId,
        score: 0,
        flag_status:false
      }, 'id');
    })
    .then(function(id) {
      // store question ID in variable for later usage
      questionID = id;
    })
    .then(function() {
      // put tags into tags table and store ids in an array
      return tagArray.forEach(function(el, ind, arr) {
        return knex('tags').insert({tag_name: el}, 'id').then(function(id) {
          tagIds.push(id);
        });
      });
    })
    .then(function() {
      // insert question/tag relationships into question_tags table
      return tagIds.forEach(function(el, ind, arr) {
        return knex('question_tags').insert({
          question_id: questionId,
          tag_id: el});
      });
    })
    .then(function(data) {
        //respond with text and question id
      res.status(200).header('Content-Type', 'application/json').send({
        'response_type': 'in_channel',
        'text': 'Thanks for posting a question to Slack Overflow ' + userSlackName + '! You can view this question at www.slackoverflow.com/question/' + questionID + '. To respond to this question, type /sflowa #title #body #' + questionID
      });
    });
  }
});


router.post('/slack/answer', function(req, res, next) {
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
  body = markdown.toHTML('body');
  var qId = messageArray[2];

  // look up user and store id
  knex('users').select('id').where('slack_id', userSlackId)
  .then(function(data) {
    userId = data[0];
  })
  .then(function() {
    return knex('answers').insert({title: title,
      body: body,
      question_id: qId,
      user_id: userId.id,
      score: 0,
      flag_status: false});
  })
  .then(function() {
    // look through subscriptions table for this question id
    // look up slack user_ids for all users associated with this question
    return knex('users').select('slack_id', 'slack_access_token')
      .join('subscriptions', {'users.id': 'subscriptions.user_id'})
      .where('subscriptions.question_id', req.params.id);
  })
  .then(function(users) {
    console.log('users', users);
    // open a channel with all subscribed users
    if (users[0] !== undefined) {
      for (i = 0; i < users.length; i++) {
        return request('https://slack.com/api/im.open?token=' + users[i].slack_access_token + '&user=' + users[i].slack_id, function(err, res, body) {
        })
        .then(function(response) {
          console.log('response', response);
          var resBody = JSON.parse(response);
          return channelArray.push({channel: resBody.channel.id, userToken: users[i].slack_access_token});
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


router.get('/questions/:id/answer', function(req, res, next) {
  var qId = req.params.id;
  var questionData;

  knex('questions').where('id', qId)
  .then(function(data) {
    questionData = data[0];
    res.render('newAnswer', {user: req.user.id, questionId: req.params.id, question: questionData});
  });
});


router.post('/questions/:id/answer', function(req, res, next) {
  var aData = req.body;
  userId = req.user.id;
  var body = markdown.toHTML(aData.body);
  var channelArray = [];
  var userArray = [];

  return knex('answers').insert({title: aData.title,
    body: aData.body,
    question_id: req.params.id,
    user_id: userId,
    score: 0,
    flag_status: false
  })
  .then(function() {
    // look through subscriptions table for this question id
    // look up slack user_ids for all users associated with this question
    return knex('users').select('slack_id', 'slack_access_token')
      .join('subscriptions', {'users.id': 'subscriptions.user_id'})
      .where('subscriptions.question_id', req.params.id);
  })
  .then(function(users) {
    console.log('users', users);
    // if there are subscribed users, open a channel with all subscribed users
    if (users[0] !== undefined) {
      for (i = 0; i < users.length; i++) {
        return request('https://slack.com/api/im.open?token=' + users[i].slack_access_token + '&user=' + users[i].slack_id, function(err, res, body) {
        })
        .then(function(response) {
          console.log('response', response);
          var resBody = JSON.parse(response);
          return channelArray.push({channel: resBody.channel.id, userToken: users[i].slack_access_token});
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

});

router.get('/questions/:id/delete', helpers.ensureAdmin, function(req, res, next) {
  knex('question_tags').where('question_id', req.params.id).del()
    .then(function() {
      return knex('answers').where('question_id', req.params.id).del();
    })
    .then(function() {
      return knex('subscriptions').where('question_id', req.params.id).del();
    })
    .then(function() {
      return knex('questions').where('id', req.params.id).del();
    })
    .then(function() {
      res.redirect('/');
    });
});

router.get('/questions/:qid/answer/:aid/delete', helpers.ensureAdmin, function(req, res, next) {
  knex('answers').where('id', req.params.aid).del()
    .then(function() {
      res.redirect('/questions/' + req.params.qid);
    });
});

router.get('/questions/:id/flag', function(req, res, next) {
  return knex('questions').where('id', req.params.id).update('flag_status', true)
    .then(function() {
      res.redirect('/questions/' + req.params.id);
    });
});

router.get('/questions/:id/unflag', helpers.ensureAdmin, function(req, res, next) {
  return knex('questions').where('id', req.params.id).update('flag_status', false)
    .then(function() {
      res.redirect('/questions/' + req.params.id);
    });
});

router.get('/questions/:qid/answer/:aid/flag', function(req, res, next) {
  return knex('answers').where('id', req.params.aid).update('flag_status', true)
    .then(function() {
        res.redirect('/questions/' + req.params.qid);
    });
});

router.get('/questions/:qid/answer/:aid/unflag', helpers.ensureAdmin, function(req, res, next) {
  return knex('answers').where('id', req.params.aid).update('flag_status', false)
    .then(function() {
      res.redirect('/questions/' + req.params.qid);
    });
});

router.post('/questions/:id/voteup', helpers.ensureAuthenticated, function(req, res, next) {
  return knex('questions').select('score').where('id', req.params.id)
    .then(function(data) {
      return (Number(data[0].score) + 1);
    })
    .then(function(newScore) {
      return knex('questions').where('id', req.params.id).update('score', newScore);
    })
    .then(function(data) {
      res.status(200).send('score updated correctly');
    });
});

router.post('/questions/:id/votedown', helpers.ensureAuthenticated, function(req, res, next) {
  return knex('questions').select('score').where('id', req.params.id)
    .then(function(data) {
      return (Number(data[0].score) - 1);
    })
    .then(function(newScore) {
      return knex('questions').where('id', req.params.id).update('score', newScore);
    })
    .then(function(data) {
      res.status(200).send('score updated correctly');
    });
});

router.post('/answers/:id/voteup', helpers.ensureAuthenticated, function(req, res, next) {
  return knex('answers').select('score').where('id', req.params.id)
    .then(function(data) {
      return (Number(data[0].score) + 1);
    })
    .then(function(newScore) {
      return knex('answers').where('id', req.params.id).update('score', newScore);
    })
    .then(function(data) {
      res.status(200).send('score updated correctly');
    });
});

router.post('/answers/:id/votedown', helpers.ensureAuthenticated, function(req, res, next) {
  return knex('answers').select('score').where('id', req.params.id)
    .then(function(data) {
      return (Number(data[0].score) - 1);
    })
    .then(function(newScore) {
      return knex('answers').where('id', req.params.id).update('score', newScore);
    })
    .then(function(data) {
      res.status(200).send('score updated correctly');
    });
});

router.post('/subscribe/:id', helpers.ensureAuthenticated, function(req, res, next) {
  user = req.user.id;
  return knex('subscriptions').insert({'user_id': user, 'question_id': req.params.id})
    .then(function() {
      res.status(200).send('You are subscribed!');
    });
});

router.post('/unsubscribe/:id', helpers.ensureAuthenticated, function(req, res, next) {
  user = req.user.id;
  return knex('subscriptions').where({'user_id': user, 'question_id': req.params.id}).del()
    .then(function() {
      res.status(200).send('You have unsubscribed!');
    });
});

module.exports = router;
