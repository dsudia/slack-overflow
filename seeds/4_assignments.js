    
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('assignments').del(),

    // Inserts seed entries
    knex('assignments').insert({name: 'intro-to-commandline'}),
    knex('assignments').insert({name: 'pixel-art-maker'}),
    knex('assignments').insert({name: 'form-based-authentication'}),
    knex('assignments').insert({name: 'express-middleware-practice'}),
    knex('assignments').insert({name: 'express-basic-auth'}),
    knex('assignments').insert({name: 'node-passport-local'}),
    knex('assignments').insert({name: 'linkedin-oauth-with-passport'})

  );
};
