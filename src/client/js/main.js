// increment question score on page and in db on arrow click
$(document).on('click', '.vote-up-q', function(e) {
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

// decrement question score on page and in db on arrow click
$(document).on('click', '.vote-down-q', function(e) {
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

//increment answer score on page and in db on arrow click
$(document).on('click', '.vote-up-a', function(e) {
  // target vote number
  var count = $(this).next();
  // get id of current question
  var answerId = count.attr('id');
  // update count on page
  var currentCount = $(count[0]).html();
  var countUp = (Number(currentCount) + 1);
  $(count[0]).html(countUp);
  // send request to update database for question's vote count
  $.ajax({
    url: '/answers/' + answerId + '/voteup',
    method: 'post',
    success: function(result) {
      console.log(result);
    }
  });
});

// decrement question score on page and in db on arrow click
$(document).on('click', '.vote-down-a', function(e) {
  // target vote number
  var count = $(this).prev();
  // get id of current question
  var answerId = count.attr('id');
  // update count on page
  var currentCount = $(count[0]).html();
  var countDown = (Number(currentCount) - 1);
  $(count[0]).html(countDown);
  // send request to update database for question's vote count
  $.ajax({
    url: '/answers/' + answerId + '/votedown',
    method: 'post',
    success: function(result) {
      console.log(result);
    }
  });
});
