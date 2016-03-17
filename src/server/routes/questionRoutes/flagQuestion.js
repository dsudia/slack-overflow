var knex = require('../../../../db/knex');

module.exports = {

  flag: function(req, res, next) {
    return knex('questions').where('id', req.params.id).update('flag_status', true)
      .then(function() {
        res.redirect('/questions/' + req.params.id);
      });
  },

  unflag: function(req, res, next) {
    return knex('questions').where('id', req.params.id).update('flag_status', false)
      .then(function() {
        res.redirect('/questions/' + req.params.id);
      });
  }

};
