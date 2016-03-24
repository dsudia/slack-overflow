
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert({
      auth_id: knex.select('id').from('auth_levels').where('level', 'admin'),
      email: 'dsudia@gmail.com'}),
    knex('users').insert({
      auth_id: knex.select('id').from('auth_levels').where('level', 'admin'),
      email: 'dbschwartz2@gmail.com'
    })
  );
};
