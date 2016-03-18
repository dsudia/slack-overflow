var knex = require('../../../../db/knex');
var quesQueries = require('../../../../queries/questions');

module.exports = {

  voteUp: function(req, res, next) {
    return quesQueries.getQuestionScore(req.params.id)
      .then(function(data) {
        return (Number(data[0].score) + 1);
      })
      .then(function(newScore) {
        return quesQueries.updateQuestionScore(req.params.id, newScore);
      })
      .then(function(data) {
        res.status(200).send('score updated correctly');
      });
  },

  voteDown: function(req, res, next) {
    return quesQueries.getQuestionScore(req.params.id)
      .then(function(data) {
        return (Number(data[0].score) - 1);
      })
      .then(function(newScore) {
        return quesQueries.updateQuestionScore(req.params.id, newScore);
      })
      .then(function(data) {
        res.status(200).send('score updated correctly');
      });
  }

};
