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

    it('should respond with a 200 and message if token is correct', function(done) {
      chai.request(server)
        .post('/slack/question')
        .send({token: '3lDITcQgUlGxWLljgFUmxQ6o',
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

    it('should respond with 401 and message if token is incorrect', function(done) {
      chai.request(server)
        .post('/slack/question')
        .send({token: '3lDITcQgUlGxWL',
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

    it('should insert a question into the database', function(done) {
      chai.request(server)
        .post('/slack/question')
        .send({token: '3lDITcQgUlGxWLljgFUmxQ6o',
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
              data.should.contain('I need help with passport!');
            });
          done();
        });
    });
  });
});
// test for getting index.html

// test for logging in as a student user

// test for viewing a question's page
  // question should load
  // answer should load

// test for registering as a student user

// test for logging out a user

// test that a user has all necessary info

// test that questions sort correctly

// test that questions have tags

// test that voting on a question works

// test that only registered users can view certain pages
