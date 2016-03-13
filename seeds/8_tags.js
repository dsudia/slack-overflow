
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('tags').del(),

    // Inserts seed entries
    knex('tags').insert({tag_name: 'knex'})
  );
};
