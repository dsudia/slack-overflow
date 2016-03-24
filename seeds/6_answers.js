
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('answers').del(),

    // Inserts seed entries
    knex('answers').insert({title: 'Need to put the table name in',
      body: 'You need to do knex(\'tablename\').select(). Without the table name it doesn\'t know what table to look at',
      question_id: knex('questions').select('id').where('title', 'Not sure how to select all from a table with parameters...'),
      user_id: knex('users').select('id').where('github_login', 'mhea0'),
      score: 0,
      flag_status: false})
  );
};
