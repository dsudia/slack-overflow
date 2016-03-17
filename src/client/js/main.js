// increment question score on page and in db on arrow click

function changeCount (qOrA, dOrU) {
  // target vote number
  var count = $(this).next();
  // get id of current question
  var id = count.attr('id');
  // update count on page
  var currentCount = $(count[0]).html();
  var countChange;
  var urlPath;
  if (dOrU === 'up') {
    countChange = (Number(currentCount) + 1);
    urlPath = '/' + qOrA +'/' + id + '/voteup';
  } else if (dOrU === 'down') {
    countChange = (Number(currentCount) - 1);
    urlPath = '/' + qOrA +'/' + id + '/votedown';
  }
  $(count[0]).html(countChange);
  // send request to update database for question's vote count
  $.ajax({
    url: urlPath,
    method: 'post',
    success: function(result) {
      console.log(result);
    }
  });
}

$(document).on('click', '.vote-up-q', function(e) {
  changeCount('questions', 'up');
});

// decrement question score on page and in db on arrow click
$(document).on('click', '.vote-down-q', function(e) {
  changeCount('questions', 'down');
});

//increment answer score on page and in db on arrow click
$(document).on('click', '.vote-up-a', function(e) {
  changeCount('answers', 'up');
});

// decrement question score on page and in db on arrow click
$(document).on('click', '.vote-down-a', function(e) {
  changeCount('answers', 'down');
});

// function to modify subscription status
function modSubscrip (action, reverseAction) {
  $('#' + action).toggleClass('form-hidden');
  $('#' + reverseAction).toggleClass('form-hidden');
  var location = window.location.href;
  var locArray = location.split('/');
  var idIndex = (Number(locArray.indexOf('questions')) + 1);
  var id = locArray[idIndex];
  $.ajax({
    url: '/' + action + '/' + id,
    method: 'post',
    success: function(result) {
      console.log(result);
    }
  });
}

// allow users to subscribe, hide subscribe button, show unsubscribe button
$('#subscribe').on('click', function() {
  modSubscrip('subscribe', 'unsubscribe');
});

// allow users to unsubscribe, hide unsubscribe button, show subscribe button
$('#unsubscribe').on('click', function() {
  modSubscrip('unsubscribe', 'subscribe');
});


var converter = new showdown.Converter();
// convert question and answer body text to markdown on render
$(document).ready(function () {
  var markdownText = document.getElementsByClassName('markdown-text');
  console.log(markdownText);
  for (i = 0; i < markdownText.length; i++) {
    console.log(i);
    var currentHTML = $(markdownText[i]).html();
    var markedText = converter.makeHtml(currentHTML);
    $(markdownText[i]).html(markedText);
  }

$("#weeks option:selected", function() {
  var cool = $("#mySelectBox option:selected").text();
    console.log(cool);
  });
});
