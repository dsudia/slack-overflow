require('dotenv').config();
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server/app');
var knex = require('../db/knex');

var should = chai.should();

chai.use(chaiHttp);


describe('API Routes', function() {

  beforeEach(function(done) {
      knex.migrate.rollback().then(function() {
          knex.migrate.latest()
          .then(function() {
              return knex.seed.run().then(function() {
                  done();
              });
          });
      });
  });

  afterEach(function(done) {
      knex.migrate.rollback().then(function() {
          done();
      });
  });

  describe('Post Question to Slack', function() {

    xit('should respond with a 200 and message if token is correct', function(done) {
      chai.request(server)
        .post('/slack/question')
        .send({token: process.env.SLACK_Q_TOKEN,
          team_id: 'T0001',
          team_domain: 'example',
          channel_id: 'C2147483705',
          channel_name: 'test',
          user_id: 'U2147483697',
          user_name: 'Dave Sudia',
          command: '/sflowq',
          text: '#I need help with passport! #Guys, where do I put the middleware? I\'m really confused about this. #express,passport',
          response_url: 'https://hooks.slack.com/commands/1234/5678'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('text');
          res.body.text.should.contain('Dave Sudia');
          done();
        });
    });

    xit('should respond with 401 and message if token is incorrect', function(done) {
      chai.request(server)
        .post('/slack/question')
        .send({token: process.env.SLACK_A_TOKEN,
          team_id: 'T0001',
          team_domain: 'example',
          channel_id: 'C2147483705',
          channel_name: 'test',
          user_id: 'U2147483697',
          user_name: 'Dave Sudia',
          command: '/sflowq',
          text: '#I need help with passport! #Guys, where do I put the middleware? I\'m really confused about this. #express,passport',
          response_url: 'https://hooks.slack.com/commands/1234/5678'})
        .end(function(err, res) {
          res.should.have.status(401);
          res.text.should.contain('Invalid token');
          done();
        });
    });

    xit('should insert a question into the database', function(done) {
      chai.request(server)
        .post('/slack/question')
        .send({token: process.env.SLACK_Q_TOKEN,
          team_id: 'T0001',
          team_domain: 'example',
          channel_id: 'C2147483705',
          channel_name: 'test',
          user_id: 'U2147483697',
          user_name: 'Dave Sudia',
          command: '/sflowq',
          text: '#I need help with passport! #Guys, where do I put the middleware? I\'m really confused about this. #express,passport',
          response_url: 'https://hooks.slack.com/commands/1234/5678'})
        .end(function(err, res) {
          knex('questions').where('user_id', 1)
            .then(function(data) {
              console.log(data);
              data[1].title.should.contain('I need help with passport!');
            });
          done();
        });
    });
  });

  describe('Post Answer to Slack', function() {

    xit('should respond with a 200 and message if token is correct', function(done) {
      chai.request(server)
        .post('/slack/answer')
        .send({token: process.env.SLACK_A_TOKEN,
          team_id: 'T0001',
          team_domain: 'example',
          channel_id: 'C2147483705',
          channel_name: 'test',
          user_id: 'U2147483697',
          user_name: 'Dave Sudia',
          command: '/sflowq',
          text: '#Re: knex #Yeah, you didn\'t put the table in there like you need to. Knex(\'users\') or something similar. #1',
          response_url: 'https://hooks.slack.com/commands/1234/5678'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('text');
          res.body.text.should.contain('Dave Sudia');
          done();
        });
    });

    xit('should respond with 401 and message if token is incorrect', function(done) {
      chai.request(server)
        .post('/slack/answer')
        .send({token: process.env.SLACK_Q_TOKEN,
          team_id: 'T0001',
          team_domain: 'example',
          channel_id: 'C2147483705',
          channel_name: 'test',
          user_id: 'U2147483697',
          user_name: 'Dave Sudia',
          command: '/sflowq',
          text: '#Re: knex #Yeah, you didn\'t put the table in there like you need to. Knex(\'users\') or something similar. #1',
          response_url: 'https://hooks.slack.com/commands/1234/5678'})
        .end(function(err, res) {
          res.should.have.status(401);
          res.text.should.contain('Invalid token');
          done();
        });
    });

    xit('should insert an answer into the database', function(done) {
      chai.request(server)
        .post('/slack/answer')
        .send({token: process.env.SLACK_A_TOKEN,
          team_id: 'T0001',
          team_domain: 'example',
          channel_id: 'C2147483705',
          channel_name: 'test',
          user_id: 'U2147483697',
          user_name: 'Dave Sudia',
          command: '/sflowq',
          text: '#Re: knex #Yeah, you didn\'t put the table in there like you need to. Knex(\'users\') or something similar. #1',
          response_url: 'https://hooks.slack.com/commands/1234/5678'})
        .end(function(err, res) {
          knex('answers').where('id', 2)
            .then(function(data) {
              data[0].title.should.contain('Re: knex');
            });
          done();
        });
    });
  });

  describe('Delete Question', function() {

    xit('should delete a question from the database', function(done) {
      chai.request(server)
        .get('/questions/1/delete')
        .end(function(err, res) {
          return knex('questions')
            .then(function(data) {
              data[0].title.should.not.contain('Not sure how to select all');
              data[0].title.should.contain('Help!');
            });
        });
        done();
    });

    it('should delete an answer from the database', function(done) {
      chai.request(server)
        .get('/questions/1/answer/1/delete')
        .end(function(err, res) {
          return knex('answers')
            .then(function(data) {
              console.log(data);
              data.should.deep.equal([]);
            });
        });
        done();
    });
  });
});
