var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server/app');
var knex = require('../db/knex');

var should = chai.should();

chai.use(chaiHttp);


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
