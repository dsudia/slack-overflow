var knex = require('../../../../db/knex');
var quesQueries = require('../../../../queries/questions');

module.exports = {

  flag: function(req, res, next) {
    return quesQueries.changeFlag(req.params.id, true)
      .then(function() {
        res.redirect('/questions/' + req.params.id);
      });
  },

  unflag: function(req, res, next) {
    return quesQueries.changeFlag(req.params.id, false)
      .then(function() {
        res.redirect('/questions/' + req.params.id);
      });
  }

};
