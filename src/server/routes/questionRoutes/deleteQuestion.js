var knex = require('../../../../db/knex');
module.exports = function(req, res, next) {
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
};
