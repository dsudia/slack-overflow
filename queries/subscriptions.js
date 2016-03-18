var knex = require('../db/knex');
var subscriptions = function(){
  return knex('subscriptions');
};

module.exports = {

  subscribe: function(user_id, question_id) {
    return subscriptions().insert({
        'user_id': user_id,
        'question_id': question_id
      });
  },

  unsubscribe: function(user_id, question_id) {
    return subscriptions().where({
        'user_id': user_id,
        'question_id': questions_id
      }).del();
  }

};
