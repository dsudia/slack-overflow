var knex = require('../db/knex');
var questions = function(){
  return knex('questions');
};

module.exports = {

  addQuestion: function(body, group_id, user_id, score, flag_status, assignment_id) {
    return questions().insert({
      body: body,
      group_id: group_id,
      user_id: user_id,
      score: 0,
      flag_status: false,
      assignment_id: assignment_id
    }, 'id');
  },

  delQuestion: function(id) {
    return knex('question_tags').where('question_id', id).del()
      .then(function() {
        return knex('answers').where('question_id', id).del();
      })
      .then(function() {
        return knex('subscriptions').where('question_id', id).del();
      })
      .then(function() {
        return questions().where('id', id).del();
      });
  },

  changeFlag: function(id, bool) {
    return knex('questions').where('id', id).update('flag_status', bool);
  },

  getAllQuestionsAndUsers: function() {
    return questions().select('questions.id', 'questions.body', 'questions.score', 'users.github_login')
      .join('users', {
        'questions.user_id': 'users.id'
      })
      .orderBy('questions.id', 'desc');
  },

  getQuestionAndUser: function(id) {
    return questions().select('questions.id', 'questions.body', 'questions.score', 'users.github_login')
      .join('users', {
        'questions.user_id': 'users.id'
      })
      .where({
      'questions.id': id
    });
  },

  getQuestionScore: function(id) {
    return questions().select('score').where('id', id);
  },

  updateQuestionScore: function(id, score) {
    return questions().where('id', id).update('score', score);
  },

  getHighscoreQuestions: function() {
    console.log('into highscore query');
    return questions().select('questions.id', 'questions.body', 'questions.score', 'users.github_login')
      .join('users', {
        'questions.user_id': 'users.id'
      })
      .orderBy('questions.score', 'desc');
  },

  getQuestionsByTag: function(tagName) {
    return questions().select('questions.id', 'questions.body', 'questions.score', 'users.github_login')
      .join('users', {
        'questions.user_id': 'users.id'
      })
      .join('question_tags', {
        'questions.id': 'question_tags.question_id'
      })
      .join('tags', {
        'tags.id': 'question_tags.tag_id'
      })
      .where('tags.tag_name', tagName)
      .orderBy('questions.id', 'desc');
  }

};
