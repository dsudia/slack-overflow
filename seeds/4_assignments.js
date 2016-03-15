
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('assignments').del(),

    // Inserts seed entries
    knex('assignments').insert({name: 'Introduction to Knex'}),
    knex('assignments').insert({name: 'CSS Positioning'})
  );
};
