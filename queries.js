var knex = require('./db/knex.js');

var auth_levels = function(){
   return knex('auth_levels');
};

var users = function(){
  return knex('users');
};

var assignments = function(){
  
};

var questions = function() {
    return knex('questions');
};

var answers = function() {
    return knex('answers');
};

var answers = function() {
    return knex('user_groups');
};

var answers = function() {
    return knex('tags');
};

var subscriptions = function() {
    return knex('subscriptions');
};

var weeks = function() {
    return knex('weeks');
};
var class_info = function() {
    return knex('class_info');
};

module.exports = {

   getAssignments: function(groupsID, weeksID){
          return knex.select('assignments.name').from('class_info')
        .innerJoin('groups', 'groups.id', 'class_info.cohort_id')
        .innerJoin('assignments', 'assignments.id', 'class_info.assign_id')
        .innerJoin('weeks', 'weeks.id', 'class_info.week_id')
        .where('groups.id', 1)
        .andWhere('weeks.id', 10);;
    }
};
