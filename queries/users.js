var knex = require('../db/knex');
var users = function(){
  return knex('users');
};

module.exports = {

  getSlackInfo: function(id) {
    console.log(id);
    return knex('users').select('slack_id', 'slack_access_token')
      .join('subscriptions', {
        'users.id': 'subscriptions.user_id'
      })
      .where('subscriptions.question_id', id);
  },

  getUserBySlackId: function(id) {
    console.log(id);
    return knex('users').select('id').where('slack_id', id);
  }

};
