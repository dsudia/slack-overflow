
exports.up = function(knex, Promise) {
  return knex.schema.createTable('questions', function(table) {
    table.increments();
    table.string('text');
    table.integer('group_id').references('groups.id');
    table.integer('user_id').references('users.id');
    table.integer('score');
    table.boolean('flag_status').defaultTo('false');
    table.integer('assignment_id').references('assignments.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('questions');
};
