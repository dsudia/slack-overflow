
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('groups').del(),

    // Inserts seed entries
    knex('groups').insert({name: 'G19'})
  );
};
