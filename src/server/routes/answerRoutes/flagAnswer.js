var knex = require('../../../../db/knex');

module.exports = {

  flag: function(req, res, next) {
    return knex('answers').where('id', req.params.aid).update('flag_status', true)
      .then(function() {
        res.redirect('/questions/' + req.params.qid);
      });
  },

  unflag: function(req, res, next) {
    return knex('answers').where('id', req.params.aid).update('flag_status', false)
      .then(function() {
        res.redirect('/questions/' + req.params.qid);
      });
  }

};
