
exports.up = function(knex, Promise) {
  return knex.schema.createTable('auth_levels', function(table) {
    table.increments();
    table.string('level').unique().notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('auth_levels');
};
