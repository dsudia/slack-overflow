
exports.up = function(knex, Promise) {
  return knex.schema.createTable('assignments', function(table) {
    table.increments();
    table.string('name').unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('assignments');
};
