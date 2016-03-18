var knex = require('../db/knex');
var users = function(){
  return knex('users');
};

module.exports = {

  getSlackInfo: function(id) {
    return knex('users').select('slack_id', 'slack_access_token')
      .join('subscriptions', {
        'users.id': 'subscriptions.user_id'
      })
      .where('subscriptions.question_id', id);
  }

};
