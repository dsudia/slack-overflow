
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('auth_levels').del(),

    // Inserts seed entries
    knex('auth_levels').insert({level: 'admin'}),
    knex('auth_levels').insert({level: 'instructor'}),
    knex('auth_levels').insert({level: 'student'})
  );
};
