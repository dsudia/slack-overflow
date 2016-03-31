// on page load show newest questions
$(document).ready(function () {
  console.log('sanity check');
  // change look of tabs
  $(this).addClass('active');
  $('#unanswered').removeClass('active');
  $('#highscore').removeClass('active');

  $.ajax({
    url: '/questions/sort/newest',
    method: 'GET',
    success: function(data) {
      var answerCountArray = data.answerCountArray;
      var questionData = data.questionData;
      var tagArray = data.tagArray;
      var numOfPages = ceiling(questionData);
      $('#page-list').empty();
      $('#question-list').empty();
      appendPages(numOfPages);
      for (i = 0; i < 10; i++) {
        appendQuestionDiv(questionData[i], answerCountArray);
      }
      addTags(tagArray);
      enablePages(questionData, answerCountArray, tagArray);
    }
  });
});

// increment question score on page and in db on arrow click
function changeCount (el, qOrA, dOrU) {
  // target vote number
  var count;
  if (dOrU === 'up') {
    count = el.next();
  } else if (dOrU === 'down') {
    count = el.prev();
  }
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
  var thisEl = $(this);
  changeCount(thisEl, 'questions', 'up');
});

// decrement question score on page and in db on arrow click
$(document).on('click', '.vote-down-q', function(e) {
  var thisEl = $(this);
  changeCount(thisEl, 'questions', 'down');
});

//increment answer score on page and in db on arrow click
$(document).on('click', '.vote-up-a', function(e) {
  var thisEl = $(this);
  changeCount(thisEl, 'answers', 'up');
});

// decrement question score on page and in db on arrow click
$(document).on('click', '.vote-down-a', function(e) {
  var thisEl = $(this);
  changeCount(thisEl, 'answers', 'down');
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
    url: action + '/' + id,
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
  for (i = 0; i < markdownText.length; i++) {
    var currentHTML = $(markdownText[i]).html();
    var markedText = converter.makeHtml(currentHTML);
    $(markdownText[i]).html(markedText);
  }

$("#weeks option:selected", function() {
  var cool = $("#mySelectBox option:selected").text();
  });
});


// truncate and expand question bodies on index page
var truncated = $('.truncate');
var truncLength = 75;

truncated.each(function() {
  var text = $(this).html();
  if (text.length > truncLength) {
    $(this).html(text.slice(0, truncLength) + '<a href="#" class="expand"><span>...</span></a>' +
  '<span style="display: none;">' + text.slice(truncLength, text.length));
  }
});

$('.expand').on('click', function() {
  event.preventDefault();
  $(this).hide();
  $(this).next().show();
});

// establish global variables for adding questions
var pageLinkHTML;
var questionDiv;
var tagDiv;


// helper functions
function ceiling (array) {
  return Math.ceil((array.length) / 10);
}

function appendPages(num) {
  for (i = 1; i <= num; i++) {
    pageLinkHTML = '<li><a class="page-link" id="' + i + '" href="javascript:void(0)">' + i + '</a></li>';
    $('#page-list').append(pageLinkHTML);
  }
}

function addAnswerCount (array, index) {
  var count = 0;
  array.forEach(function(el, ind, arr) {
    if (el.question_id === index.id) {
      return count += Number(el.count);
    }
  });
  return count;
}

function appendQuestionDiv(index, answerCountArray) {
  if (index) {
    var count = addAnswerCount(answerCountArray, index);
    questionDiv = '<article class="question-summary flex-container"><div class="flex-item-size-1"><h4>' + index.score + '</h4><p>rating</p></div><div class="flex-item-size-1"><h4 class="answer-count">' + count + '</h4><p>answers</p></div><div class="flex-item-size-3"><a href="questions/' + index.id + '"><h5 class="truncate">' + index.body + '</h5></a><h6>Posted by ' + index.github_login + '</h6><div class="tag-collection" id="question' + index.id + '"></div></div></article>';
    $('#question-list').append(questionDiv);
  }
}

function appendUnansweredQuestionDiv(index, answerCountArray) {
  if (index) {
    var count = addAnswerCount(answerCountArray, index);
    if (count === 0) {
      questionDiv = '<article class="question-summary flex-container"><div class="flex-item-size-1"><h4>' + index.score + '</h4><p>rating</p></div><div class="flex-item-size-1"><h4 class="answer-count">' + count + '</h4><p>answers</p></div><div class="flex-item-size-3"><a href="questions/' + index.id + '"><h5 class="truncate">' + index.body + '</h5></a><h6>Posted by ' + index.github_login + '</h6><div class="tag-collection" id="question' + index.id + '"></div></div></article>';
      $('#question-list').append(questionDiv);
    }
  }
}

function addTags (array) {
  var tagDivList = document.getElementsByClassName('tag-collection');
  array.forEach(function(el, ind, arr) {
    for(i = 0; i < tagDivList.length; i++) {
      var divId = $(tagDivList[i]).attr('id');
      var questionId = 'question' + el.question_id;
      if (divId == questionId) {
        tagDiv = '<div class="tag-btn btn btn-sm btn-info">' + el.tag_name + '</div>';
        return $(tagDivList[i]).append(tagDiv);
      }
    }
  });

}

function enablePages (questionData, answerCountArray, tagArray) {
  $(document).on('click', '.page-link', function() {
    var num = $(this).attr('id');
    $('#question-list').empty();
    if (num === 1) {
      for (i = 0; i < 10; i++) {
        appendQuestionDiv(questionData[i], answerCountArray);
      }
    } else {
      for (i = (num * 10 - 10); i < (num * 10); i++) {
        appendQuestionDiv(questionData[i], answerCountArray);
      }
    }
    addTags(tagArray);
  });
}


// sort questions by unanswered
$('#unanswered').on('click', function() {
  // change look of tabs
  $(this).addClass('active');
  $('#newest').removeClass('active');
  $('#highscore').removeClass('active');

  // populate only questions with no answers
  $.ajax({
    url: '/questions/sort/newest',
    method: 'GET',
    success: function(data) {
      var answerCountArray = data.answerCountArray;
      var questionData = data.questionData;
      var tagArray = data.tagArray;
      var numOfPages = ceiling(questionData);
      $('#page-list').empty();
      $('#question-list').empty();
      appendPages(numOfPages);
      for (i = 0; i < 10; i++) {
        appendUnansweredQuestionDiv(questionData[i], answerCountArray);
      }
      addTags(tagArray);
      enablePages(questionData, answerCountArray, tagArray);
    }
  });
});


// sort questions by newest
$('#newest').on('click', function() {
  // change look of tabs
  $(this).addClass('active');
  $('#unanswered').removeClass('active');
  $('#highscore').removeClass('active');

  $.ajax({
    url: '/questions/sort/newest',
    method: 'GET',
    success: function(data) {
      var answerCountArray = data.answerCountArray;
      var questionData = data.questionData;
      var tagArray = data.tagArray;
      var numOfPages = ceiling(questionData);
      $('#page-list').empty();
      $('#question-list').empty();
      appendPages(numOfPages);
      for (i = 0; i < 10; i++) {
        appendQuestionDiv(questionData[i], answerCountArray);
      }
      addTags(tagArray);
      enablePages(questionData, answerCountArray, tagArray);
    }
  });
});


// sort questions by high score
$('#highscore').on('click', function() {
  // change look of tabs
  $(this).addClass('active');
  $('#newest').removeClass('active');
  $('#unanswered').removeClass('active');

  $.ajax({
    url: '/questions/sort/score',
    method: 'GET',
    success: function(data) {
      var answerCountArray = data.answerCountArray;
      var questionData = data.questionData;
      var tagArray = data.tagArray;
      var numOfPages = ceiling(questionData);
      $('#page-list').empty();
      $('#question-list').empty();
      appendPages(numOfPages);
      for (i = 0; i < 10; i++) {
        appendQuestionDiv(questionData[i], answerCountArray);
      }
      addTags(tagArray);
      enablePages(questionData, answerCountArray, tagArray);
    }
  });
});


$('#tags').on('click', function() {
  $('#highscore').removeClass('active');
  $('#newest').removeClass('active');
  $('#unanswered').removeClass('active');
  $('#tags').addClass('active');
});

//sort questions by tag
$(document).on('click', '#sort-tags', function() {
  // change look of tabs
  $('#highscore').removeClass('active');
  $('#newest').removeClass('active');
  $('#unanswered').removeClass('active');
  var tag = $('tag-list').val();

  // populate only questions with passed tag
  $.ajax({
    url: '/questions/sort/tags/?tag=' + tag,
    method: 'GET',
    success: function(data) {
      var answerCountArray = data.answerCountArray;
      var questionData = data.questionData;
      var tagArray = data.tagArray;
      var numOfPages = ceiling(questionData);
      $('#page-list').empty();
      $('#question-list').empty();
      appendPages(numOfPages);
      for (i = 0; i < 10; i++) {
        appendQuestionDiv(questionData[i], answerCountArray);
      }
      addTags(tagArray);
      enablePages(questionData, answerCountArray, tagArray);
    }
  });
});

// retrieve users from database and place on page
$('#name-search').on('keyup', function() {
  var searchId = $(this).val();
  var dataString = 'search=' + searchId;
  $.ajax({
    url: '/staff/searchUsers/search',
    data: dataString,
    cache: false,
    method: 'GET',
    success: function(data) {
      $('#user-table-header').nextAll().remove();
      data.forEach(function(el, ind, arr) {
        var auth = '';
        if (el.auth_id === 1) {
          auth = 'Admin';
        } else if (el.auth_id === 2) {
          auth = 'Instructor';
        } else if (el.auth_id === 3) {
          auth = 'Student';
        }
        $('#user-table').append('<tr><td>' + el.id +
          '</td><td>' + el.first_name +
          '</td><td>' + el.last_name +
          '</td><td>' + el.email +
          '</td><td>' + auth +
          '</td><td><a href="/staff/updateUser/' + el.id + '"><button class="btn btn-sm btn-info">Update</button></a></td></tr>');
      });
    }
  });
});
