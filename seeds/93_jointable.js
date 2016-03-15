
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('join_table').del(), 

    // Inserts seed entries
    knex('join_table').insert({week_id: 1, cohort_id: 2, assign_id: 1}),
    knex('join_table').insert({week_id: 2, cohort_id: 2, assign_id: 2}),
    knex('join_table').insert({week_id: 10, cohort_id: 1, assign_id: 3}),
    knex('join_table').insert({week_id: 10, cohort_id: 1, assign_id: 4}),
    knex('join_table').insert({week_id: 10, cohort_id: 1, assign_id: 5}),
    knex('join_table').insert({week_id: 10, cohort_id: 1, assign_id: 6}),
    knex('join_table').insert({week_id: 10, cohort_id: 1, assign_id: 7})
  );
};
