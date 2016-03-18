var knex = require('../db/knex');
var groups = function(){
  return knex('groups');
};

module.exports = {

  getGroupBySlackChannel: function(channel_id) {
    return groups().select('id').where('slack_channel', channel_id);
  }

};
