
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert({first_name: 'David',
      last_name: 'Sudia',
      auth_id: knex.select('id').from('auth_levels').where('level', 'student'),
      username: 'dsudia',
      password: '$2a$10$Dx98AoY3XU7E5EPfAXIU5uzhGPjIg1wlXWqL1lnDpnKGeJZCmRbfa',
      email: 'dsudia@gmail.com',
      score: 0}),
    knex('users').insert({first_name: 'Michael',
      last_name: 'Herman',
      auth_id: knex.select('id').from('auth_levels').where('level', 'instructor'),
      username: 'mhea0',
      password: '$2a$10$Dx98AoY3XU7E5EPfAXIU5uzhGPjIg1wlXWqL1lnDpnKGeJZCmRbfa',
      email: 'mike@mike.com',
      score: 0}),
    knex('users').insert({first_name: 'Kelly',
      last_name: 'Kawa',
      auth_id: knex.select('id').from('auth_levels').where('level', 'admin'),
      username: 'kkawa',
      password: '$2a$10$qJeCXAvExBxUrjWs19N/1enEzDM0feb4dccfgLF4ZqNsxTLGMcHtW',
      email: 'kelly@kelly.com',
      score: 0})
  );
};
