
exports.up = function(knex, Promise) {
  return knex.schema.dropTable('user_groups');
};

exports.down = function(knex, Promise) {
  return knex.schema.createTable('user_groups', function(table) {
    table.increments();
    table.integer('user_id').references('users.id');
    table.integer('group_id').references('groups.id');
  });
};
