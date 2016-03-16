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

        return knex.select('assignments.name', 'assignments.id').from('class_info')
        .innerJoin('groups', 'groups.id', 'class_info.cohort_id')
        .innerJoin('assignments', 'assignments.id', 'class_info.assign_id')
        .innerJoin('weeks', 'weeks.id', 'class_info.week_id')
        .where('groups.id', +groupsID)
        .andWhere('weeks.id', +weeksID);;
    },


    getQuestions: function(assignmentID, scope){
        scope = +scope;
        if(scope===0){
            return questions().where('assignment_id', +assignmentID);

        }else{
            return questions().where('assignment_id', +assignmentID).andWhere('group_id', +scope);
         }
    },

    getAnswers: function(assignmentID, scope){

    }
};
