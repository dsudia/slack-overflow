
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('subscriptions').del(),

    // Inserts seed entries
    knex('subscriptions').insert({user_id: knex('users').select('id').where('github_login', 'dsudia'),
      question_id: knex('questions').select('id').where('title', 'Not sure how to select all from a table with parameters...')})
  );
};
