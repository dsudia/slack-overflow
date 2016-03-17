module.exports = function(req, res, next) {
  var qId = req.params.id;
  var questionData;

  knex('questions').where('id', qId)
    .then(function(data) {
      questionData = data[0];
      res.render('newAnswer', {
        user: req.user.id,
        questionId: req.params.id,
        question: questionData
      });
    });
};
