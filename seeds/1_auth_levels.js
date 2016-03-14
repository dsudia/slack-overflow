
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entrie  s
    knex('auth_levels').del(),

    // Inserts seed entries
    knex('auth_levels').insert({level: 'admin'}),
    knex('auth_levels').insert({level: 'instructor'}),
    knex('auth_levels').insert({level: 'student'})
  );
};
