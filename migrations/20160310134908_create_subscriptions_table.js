
exports.up = function(knex, Promise) {
  return knex.schema.createTable('subscriptions', function(table) {
    table.increments();
    table.integer('user_id').references('users.id');
    table.integer('question_id').references('questions.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('subscriptions');
};
