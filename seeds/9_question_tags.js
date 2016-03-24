
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('question_tags').del(),

    // Inserts seed entries
    knex('question_tags').insert({question_id: knex('questions').select('id').where('body', 'Hey class. I\'m trying to select all the entries from a table using a where statement, and I can\'t figure out how to do it. I\'ve tried knex.select().where(\'name\', Dave). It\'s not working. Help!'),
      tag_id: knex('tags').select('id').where('tag_name', 'knex')}),
    knex('question_tags').insert({question_id: knex('questions').select('id').where('body', 'Relative and absolute and fixed, oh my! Can anyone give me a good explanation of the differences?'),
      tag_id: knex('tags').select('id').where('tag_name', 'css')}),
    knex('question_tags').insert({question_id: knex('questions').select('id').where('body', 'Relative and absolute and fixed, oh my! Can anyone give me a good explanation of the differences?'),
      tag_id: knex('tags').select('id').where('tag_name', 'positioning')})
  );
};
