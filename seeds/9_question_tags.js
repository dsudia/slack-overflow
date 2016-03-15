
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('question_tags').del(),

    // Inserts seed entries
    knex('question_tags').insert({question_id: knex('questions').select('id').where('title', 'Not sure how to select all from a table with parameters...'),
      tag_id: knex('tags').select('id').where('tag_name', 'knex')}),
    knex('question_tags').insert({question_id: knex('questions').select('id').where('title', 'Help! I can\'t figure out CSS positioning!'),
      tag_id: knex('tags').select('id').where('tag_name', 'css')}),
    knex('question_tags').insert({question_id: knex('questions').select('id').where('title', 'Help! I can\'t figure out CSS positioning!'),
      tag_id: knex('tags').select('id').where('tag_name', 'positioning')})
  );
};
