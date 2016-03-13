
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('questions').del(),

    // Inserts seed entries
    knex('questions').insert({title: 'Not sure how to select all from a table with parameters...',
      body: 'Hey class. I\'m trying to select all the entries from a table using a where statement, and I can\'t figure out how to do it. I\'ve tried knex.select().where(\'name\', Dave). It\'s not working. Help!',
      group_id: knex('groups').select('id').where('name', 'G19'),
      user_id: knex('users').select('id').where('username', 'dsudia'),
      score: 0,
      flag_status: false,
      assignment_id: knex('assignments').select('id').where('name', 'Introduction to Knex')})
  );
};
