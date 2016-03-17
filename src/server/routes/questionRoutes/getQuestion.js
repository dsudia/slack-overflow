module.exports = function(req, res, next) {
  var userId = req.user.id;
  var qId = req.params.id;
  var questionData;
  var tagList = [];
  var answerList = [];
  if (qId === 'new') {
    return knex('groups')
      .then(function(cohorts) {
        res.render('newQuestion', {
          user: req.user,
          cohorts: cohorts,
          title: 'Slack Overflow - Post a Question'
        });
      });
  } else if (qId !== 'new') {
    return knex('questions').select('questions.id', 'questions.title', 'questions.body', 'questions.score', 'users.username')
      .join('users', {
        'questions.user_id': 'users.id'
      })
      .where({
        'questions.id': qId
      }).then(function(data) {
        questionData = data;
      }).then(function() {
        return knex('tags').select('tag_name').where('questions.id', qId)
          .join('question_tags', {
            'tags.id': 'question_tags.tag_id'
          })
          .join('questions', {
            'questions.id': 'question_tags.question_id'
          });
      }).then(function(tagData) {
        tagData.forEach(function(el, ind, arr) {
          return tagList.push(el.tag_name);
        });
      }).then(function() {
        return knex('answers').select('answers.id', 'answers.title', 'answers.body', 'users.username')
          .join('users', {
            'answers.user_id': 'users.id'
          })
          .where('question_id', qId);
      }).then(function(answers) {
        console.log(answers);
        answers.forEach(function(el, ind, arr) {
          return answerList.push(el);
        });
      }).then(function() {
        res.render('question', {
          title: 'Slack Overflow - ' + questionData.title,
          question: questionData[0],
          tags: tagList,
          answers: answerList,
          user: req.user
        });
      });
  }
};
