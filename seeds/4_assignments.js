
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('assignments').del(),

    // Inserts seed entries
    knex('assignments').insert({name: 'Introduction to Knex'}),
    knex('assignments').insert({name: 'CSS Positioning'}),
    knex('assignments').insert({name: 'express-basic-auth'}),
    knex('assignments').insert({name: 'node-passport-local'}),
    knex('assignments').insert({name: 'node-stripe-example'})

  );
};
