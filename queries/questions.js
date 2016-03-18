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
  },

  delQuestion: function(id) {
    knex('question_tags').where('question_id', id).del()
      .then(function() {
        return knex('answers').where('question_id', id).del();
      })
      .then(function() {
        return knex('subscriptions').where('question_id', id).del();
      })
      .then(function() {
        questions().where('id', id).del();
      });
  }

};
