var answerQueries = require('../../../../queries/answers');

module.exports = {

  flag: function(req, res, next) {
    return answerQueries.flagAnswer(req.params.aid)
      .then(function() {
        res.redirect('/questions/' + req.params.qid);
      });
  },

  unflag: function(req, res, next) {
    return answerQueries.unflagAnswer(req.params.aid)
      .then(function() {
        res.redirect('/questions/' + req.params.qid);
      });
  }

};
