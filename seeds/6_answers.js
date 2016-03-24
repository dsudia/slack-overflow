
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('answers').del(),

    // Inserts seed entries
    knex('answers').insert({body: 'You need to do knex(\'tablename\').select(). Without the table name it doesn\'t know what table to look at',
      question_id: knex('questions').select('id').where('body', 'Hey class. I\'m trying to select all the entries from a table using a where statement, and I can\'t figure out how to do it. I\'ve tried knex.select().where(\'name\', Dave). It\'s not working. Help!'),
      user_id: knex('users').select('id').where('github_login', 'dsudia'),
      score: 0,
      flag_status: false})
  );
};
