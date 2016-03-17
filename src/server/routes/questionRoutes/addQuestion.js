module.exports = function(req, res, next) {
  // store form info in a variable
  var user = req.user;
  var qData = req.body;
  console.log(qData.user_id);
  var tagList = req.body.tags;
  tagList = tagList.replace(/ /g, '');
  tagList = tagList.toLowerCase();
  var tagArray = tagList.split(',');
  var tagIds = [];
  var questionID;
  var body = markdown.toHTML(qData.body);

  // insert question data into questions table, get question's ID back
  knex('questions').insert({
    title: qData.title,
    body: body,
    group_id: qData.group_id,
    user_id: req.user.id,
    score: 0,
    flag_status: false,
    assignment_id: qData.assignment_id
  }, 'id').then(function(id) {
    // store question ID in variable for later usage
    questionID = id;
  }).then(function() {
    // put tags into tags table and store ids in an array
    tagArray.forEach(function(el, ind, arr) {
      return knex('tags').insert({
        tag_name: el
      }, 'id').then(function(id) {
        tagIds.push(id);
      });
    });
  }).then(function() {
    // insert question/tag relationships into question_tags table
    tagIds.forEach(function(el, ind, arr) {
      knex('question_tags').insert({
        question_id: questionId,
        tag_id: el
      });
    });
  }).then(function(data) {
    //render question page
    res.redirect('/questions/' + questionID);
  });
}
