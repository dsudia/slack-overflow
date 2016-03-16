// add scripts
$(document).on('click', '.vote-up', function(e) {

  // target vote number
  var count = $(this).next();
  // get id of current question
  var questionId = count.attr('id');
  // update count on page
  var currentCount = $(count[0]).html();
  var countUp = (Number(currentCount) + 1);
  $(count[0]).html(countUp);
  // send request to update database for question's vote count
  $.ajax({
    url: '/questions/' + questionId + '/voteup',
    method: 'post',
    success: function(result) {
      console.log(result);
    }
  });
});

$(document).on('click', '.vote-down', function(e) {
  // target vote number
  var count = $(this).prev();
  // get id of current question
  var questionId = count.attr('id');
  // update count on page
  var currentCount = $(count[0]).html();
  var countDown = (Number(currentCount) - 1);
  $(count[0]).html(countDown);
  // send request to update database for question's vote count
  $.ajax({
    url: '/questions/' + questionId + '/votedown',
    method: 'post',
    success: function(result) {
      console.log(result);
    }
  });
});
