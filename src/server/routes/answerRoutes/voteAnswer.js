var knex = require('../../../../db/knex');
var answerQueries = require('../../../../queries/answers');

module.exports = {

  voteUp: function(req, res, next) {
    answerQueries.selectScore(req.params.id)
      .then(function(data) {
        return (Number(data[0].score) + 1);
      })
      .then(function(newScore) {
        answerQueries.updateScore(req.params.id, newScore)
      })
      .then(function(data) {
        res.status(200).send('score updated correctly');
      });
  },

  voteDown: function(req, res, next) {
     answerQueries.selectScore(req.params.id)
      .then(function(data) {
        return (Number(data[0].score) - 1);
      })
      .then(function(newScore) {
        answerQueries.updateScore(req.params.id, newScore)
      })
      .then(function(data) {
        res.status(200).send('score updated correctly');
      });
  }

};
