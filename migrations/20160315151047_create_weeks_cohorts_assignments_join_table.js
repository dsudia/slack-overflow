
exports.up = function(knex, Promise) {
  return knex.schema.createTable('join_table', function(table) {
    table.increments();
    table.integer('week_id')
      .references('id')
      .inTable('weeks');
    table.integer('cohort_id')
      .references('id')
      .inTable('groups');
    table.integer('assign_id')
      .references('id')
      .inTable('assignments');
  }); 
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable('join_table');
};
