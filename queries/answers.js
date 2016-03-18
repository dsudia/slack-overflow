var knex = require('../db/knex');
var answers = function(){
  return knex('answers');
}

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
  postAnswer: function(title, body, question_id, user_id, score, flag_status) {
    return answers()
          .insert({ title: title,
                    body: body,
                    question_id: question_id,
                    user_id: user_id,
                    score: score,
                    flag_status: flag_status
                    });
  },
  selectAnswerScore: function(answerID) {
    return answers()
          .select('score')
          .where('id', answerID);
  },
  updateAnswer: function(newScore, answerID){
    return answers()
          .select('score')
          .where('id', req.params.id)
          .update('score', newScore);
  }

};