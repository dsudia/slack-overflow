var knex = require('../../../../db/knex');
var subQueries = require('../../../../queries/subscriptions');

module.exports = {

  subscribe: function(req, res, next) {
    user = req.user.id;
    return subQueries.subscribe(user, req.params.id)
      .then(function() {
        res.status(200).send('You are subscribed!');
      });
  },

  unsubscribe: function(req, res, next) {
    user = req.user.id;
    return subQueries.unsubscribe(user, req.params.id)
      .then(function() {
        res.status(200).send('You have unsubscribed!');
      });
  }

};
