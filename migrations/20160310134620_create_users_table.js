
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.integer('auth_id').references('auth_levels.id').notNullable();
    table.string('password');
    table.string('email').unique().notNullable();
    table.integer('score');
    table.string('slack_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
