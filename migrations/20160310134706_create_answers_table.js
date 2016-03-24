
exports.up = function(knex, Promise) {
  return knex.schema.createTable('answers', function(table) {
    table.increments();
    table.text('body');
    table.integer('question_id').references('questions.id');
    table.integer('user_id').references('users.id');
    table.integer('score');
    table.boolean('flag_status').defaultTo('false');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('answers');
};
