
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('github_id').unique();
    table.string('github_login');
    table.string('github_avatar');
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.integer('auth_id').references('id').inTable('auth_levels').notNullable();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.string('email').unique().notNullable();
    table.integer('score');
    table.string('slack_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
