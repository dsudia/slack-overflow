
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('class_info').del(), 

    // Inserts seed entries
    knex('class_info').insert({week_id: 1, cohort_id: 2, assign_id: 1}),
    knex('class_info').insert({week_id: 2, cohort_id: 2, assign_id: 2}),
    knex('class_info').insert({week_id: 10, cohort_id: 1, assign_id: 3}),
    knex('class_info').insert({week_id: 10, cohort_id: 1, assign_id: 4}),
    knex('class_info').insert({week_id: 10, cohort_id: 1, assign_id: 5}),
    knex('class_info').insert({week_id: 10, cohort_id: 1, assign_id: 6}),
    knex('class_info').insert({week_id: 10, cohort_id: 1, assign_id: 7})
  );
};
