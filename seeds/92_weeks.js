
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('weeks').del(), 

    // Inserts seed entries
    knex('weeks').insert({week: 1}),
    knex('weeks').insert({week: 2}),
    knex('weeks').insert({week: 3}),
    knex('weeks').insert({week: 4}),
    knex('weeks').insert({week: 5}),
    knex('weeks').insert({week: 6}),
    knex('weeks').insert({week: 7}),
    knex('weeks').insert({week: 8}),    
    knex('weeks').insert({week: 9}),
    knex('weeks').insert({week: 10}),
    knex('weeks').insert({week: 11}),    
    knex('weeks').insert({week: 12}),
    knex('weeks').insert({week: 13}),
    knex('weeks').insert({week: 14}),
    knex('weeks').insert({week: 15}),
    knex('weeks').insert({week: 16}),
    knex('weeks').insert({week: 17}),
    knex('weeks').insert({week: 18}),
    knex('weeks').insert({week: 19}),
    knex('weeks').insert({week: 20}),
    knex('weeks').insert({week: 21}),
    knex('weeks').insert({week: 22}),
    knex('weeks').insert({week: 23}),
    knex('weeks').insert({week: 24})
  );
};
