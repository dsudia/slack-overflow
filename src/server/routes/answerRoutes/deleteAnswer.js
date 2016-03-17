module.exports = function(req, res, next) {
  knex('answers').where('id', req.params.aid).del()
    .then(function() {
      res.redirect('/questions/' + req.params.qid);
    });
};
