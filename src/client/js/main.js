// add scripts
$(document).on('click', '.vote-up', function(e) {
  var count = $(this).next();
  var currentCount = $(count[0]).html();
  var countUp = (Number(currentCount) + 1);
  $(count[0]).html(countUp);
  // $.ajax({
  //   url: 'http://slackoverflowapp.herokuapp.com/question/voteup',
  //   method: 'post',
  // });
});

$(document).on('click', '.vote-down', function(e) {
  var count = $(this).prev();
  var currentCount = $(count[0]).html();
  var countDown = (Number(currentCount) - 1);
  $(count[0]).html(countDown);
  // $.ajax({
  //   url: 'http://slackoverflowapp.herokuapp.com/question/voteup',
  //   method: 'post',
  // });
});
