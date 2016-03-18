var knex = require('../../../../db/knex');
var quesQueries = require('../../../../queries/questions');

module.exports = function(req, res, next) {
  return quesQueries.delQuestion(req.params.id)
    .then(function() {
      res.redirect('/');
    });
};
