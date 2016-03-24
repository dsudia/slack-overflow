
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('subscriptions').del(),

    // Inserts seed entries
    knex('subscriptions').insert({user_id: knex('users').select('id').where('github_login', 'dsudia'),
      question_id: knex('questions').select('id').where('body', 'Hey class. I\'m trying to select all the entries from a table using a where statement, and I can\'t figure out how to do it. I\'ve tried knex.select().where(\'name\', Dave). It\'s not working. Help!')})
  );
};
