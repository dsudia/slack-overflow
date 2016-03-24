
exports.up = function(knex, Promise) {
  return knex.schema.dropTable('user_groups');
};

exports.down = function(knex, Promise) {
  return knex.schema.createTable('user_groups');
};
