var knex = require('../../../../db/knex');
var answerQueries = require('../../../../queries/answers');

module.exports = {

  flag: function(req, res, next) {
    answerQueries.flagAnswer(req.params.aid)
      .then(function() {
        res.redirect('/questions/' + req.params.qid);
      });
  },

  unflag: function(req, res, next) {
    answerQueries.unflagAnswer(req.params.aid)
      .then(function() {
        res.redirect('/questions/' + req.params.qid);
      });
  }

};
