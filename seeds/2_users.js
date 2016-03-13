
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('table_name').del(),

    // Inserts seed entries
    knex('table_name').insert({first_name: 'David',
      last_name: 'Sudia',
      auth_id: knex.select('id').from('auth_levels').where('level', 'student'),
      username: 'dsudia',
      password: '$2a$10$MwJW5v.EI4PvnwUwmJg6wOGDJyIhhxFeF1mH8QDWF4twBfVCxVlNa',
      email: 'dsudia@gmail.com',
      score: 0}),
    knex('table_name').insert({first_name: 'Michael',
      last_name: 'Herman',
      auth_id: knex.select('id').from('auth_levels').where('level', 'instructor'),
      username: 'mhea0',
      password: '$2a$10$Dx98AoY3XU7E5EPfAXIU5uzhGPjIg1wlXWqL1lnDpnKGeJZCmRbfa',
      email: 'dsudia@gmail.com',
      score: 0}),
    knex('table_name').insert({first_name: 'Kelly',
      last_name: 'Kawa',
      auth_id: knex.select('id').from('auth_levels').where('level', 'admin'),
      username: 'kkawa',
      password: '$2a$10$qJeCXAvExBxUrjWs19N/1enEzDM0feb4dccfgLF4ZqNsxTLGMcHtW',
      email: 'dsudia@gmail.com',
      score: 0})
  );
};
