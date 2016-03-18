var knex = require('../db/knex');
var tags = function(){
  return knex('tags');
};

module.exports = {

  searchTags: function(name) {
    return tags().select('id').where('tag_name', name);
  },

  insertTagsToTags: function(name) {
    return tags().insert({
      tag_name: name
    }, 'id');
  },

  insertTagsToQT: function(qId, tId) {
    return knex('question_tags').insert({
      question_id: qId,
      tag_id: tId
    });
  }

};
