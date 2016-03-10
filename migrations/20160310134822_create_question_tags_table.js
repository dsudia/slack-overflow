
exports.up = function(knex, Promise) {
  return knex.schema.createTable('question_tags', function(table) {
    table.increments();
    table.integer('question_id').references('questions.id');
    table.integer('tag_id').references('tags.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('question_tags');
};
