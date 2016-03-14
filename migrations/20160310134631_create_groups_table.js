
exports.up = function(knex, Promise) {
  return knex.schema.createTable('groups', function(table) {
    table.increments();
    table.string('name').notNullable();
    table.string('slack_channel');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('groups');
};
