
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('user_groups').del(),

    // Inserts seed entries
    knex('user_groups').insert({user_id: knex('users').select('id').where('username', 'dsudia'),
      group_id: knex('groups').select('id').where('name', 'G19')}),
    knex('user_groups').insert({user_id: knex('users').select('id').where('username', 'mhea0'),
      group_id: knex('groups').select('id').where('name', 'G19')}),
    knex('user_groups').insert({user_id: knex('users').select('id').where('username', 'kkawa'),
      group_id: knex('groups').select('id').where('name', 'G19')})
  );
};
