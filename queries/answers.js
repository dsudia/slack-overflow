var knex = require('../db/knex');
var answers = function(){
  return knex('answers');
};

module.exports = {
  deleteAnswer: function(answerID) {
    return answers()
          .where('id', answerID)
          .del();
  },
  flagAnswer: function(answerID) {
    return answers()
          .where('id', answerID)
          .update('flag_status', true);
  },
  unflagAnswer: function(answerID) {
    return answers()
           .where('id', answerID)
           .update('flag_status', false);
  },
  postAnswer: function(body, question_id, user_id, score, flag_status) {
    return answers()
          .insert({body: body,
                    question_id: question_id,
                    user_id: user_id,
                    score: score,
                    flag_status: flag_status
                    });
  },
  selectScore: function(answerID) {
    return answers()
          .select('score')
          .where('id', answerID);
  },

  updateScore: function(answerID, newScore){
    return answers()
          .select('score')
          .where('id', req.params.id)
          .update('score', newScore);
  },

  getAnswers: function(id) {
    return answers().select('answers.id', 'answers.body', 'users.github_login')
      .join('users', {
        'answers.user_id': 'users.id'
      })
      .where('question_id', id);
  },

  getAnswerCount: function() {
    return answers().select('question_id').count().groupBy('question_id');
  }

};
