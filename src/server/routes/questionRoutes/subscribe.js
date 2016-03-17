var knex = require('../../../../db/knex');

module.exports = {

  subscribe: function(req, res, next) {
    user = req.user.id;
    return knex('subscriptions').insert({
        'user_id': user,
        'question_id': req.params.id
      })
      .then(function() {
        res.status(200).send('You are subscribed!');
      });
  },

  unsubscribe: function(req, res, next) {
    user = req.user.id;
    return knex('subscriptions').where({
        'user_id': user,
        'question_id': req.params.id
      }).del()
      .then(function() {
        res.status(200).send('You have unsubscribed!');
      });
  }

};
