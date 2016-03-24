
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('github_id').unique();
    table.string('github_login');
    table.string('github_avatar');
    table.string('first_name');
    table.string('last_name');
    table.integer('auth_id').references('id').inTable('auth_levels').notNullable();
    table.string('email').unique().notNullable();
    table.integer('score').default(0);
    table.string('slack_id');
    table.string('slack_access_token');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
