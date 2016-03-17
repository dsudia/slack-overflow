var knex = require('../../../../db/knex');

module.exports = {

  voteUp: function(req, res, next) {
    return knex('answers').select('score').where('id', req.params.id)
      .then(function(data) {
        return (Number(data[0].score) + 1);
      })
      .then(function(newScore) {
        return knex('answers').where('id', req.params.id).update('score', newScore);
      })
      .then(function(data) {
        res.status(200).send('score updated correctly');
      });
  },

  voteDown: function(req, res, next) {
    return knex('answers').select('score').where('id', req.params.id)
      .then(function(data) {
        return (Number(data[0].score) - 1);
      })
      .then(function(newScore) {
        return knex('answers').where('id', req.params.id).update('score', newScore);
      })
      .then(function(data) {
        res.status(200).send('score updated correctly');
      });
  }

};
