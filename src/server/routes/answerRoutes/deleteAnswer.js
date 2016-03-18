var knex = require('../../../../db/knex');
var answerQueries = require('../../../../queries/answers');


module.exports = function(req, res, next) {
  knex('answers').where('id', req.params.aid).del()
    .then(function() {
      res.redirect('/questions/' + req.params.qid);
    });
};
