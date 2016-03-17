var voteAnswer = require('./answerRoutes/voteAnswer');

router.post('/:id/voteup', helpers.ensureAuthenticated, function(req, res, next) {
  voteAnswer.voteUp();
});

router.post('/:id/votedown', helpers.ensureAuthenticated, function(req, res, next) {
  voteAnswer.voteDown();
});
