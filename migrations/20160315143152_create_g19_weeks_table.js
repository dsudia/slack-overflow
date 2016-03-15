
exports.up = function(knex, Promise) {
  return knex.schema.createTable('weeks', function(table) {
    table.increments();
    table.integer('week');
  });
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable('weeks');
};
