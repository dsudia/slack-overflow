var knex = require('../db/knex');
var questions = function(){
  return knex('questions');
};

module.exports = {

  addQuestion: function(title, body, group_id, user_id, score, flag_status, assignment_id) {
    return questions().insert({
      title: qData.title,
      body: body,
      group_id: qData.group_id,
      user_id: req.user.id,
      score: 0,
      flag_status: false,
      assignment_id: qData.assignment_id
    }, 'id');
  }

};
