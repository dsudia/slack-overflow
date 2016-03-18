var knex = require('../../../../db/knex');
var answerQueries = require('../../../../queries/answers');


module.exports = function(req, res, next) {
  answerQueries.deleteAnswer(req.params.aid)
    .then(function() {
      res.redirect('/questions/' + req.params.qid);
    });
};
