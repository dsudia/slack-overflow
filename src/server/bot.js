function runSlackBot () {
  // *** configure Slack bot *** //
  //create RTM client
  var RtmClient = require('@slack/client').RtmClient;
  var token = process.env.SLACK_BOT_TOKEN || '';
  var rtm = new RtmClient(token);
  rtm.start();

  // capture rtm.start payload
  var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

  rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData) {
    console.log('You are authenticated!');
  });

  // listen to messages
  var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
  rtm.on(RTM_EVENTS.MESSAGE, function(message) {
    console.log('You received this message: ', message);
    var text = message.text;
    if (text) {
      text = text.toLowerCase();
    }
    var channel = message.channel;
    var quesResponse = 'Thanks for asking! To ask a question, you use the / command /sflowq. \nThe format for a question is bodyOfYourQuestion #tags,tags. An example would be "/sflowq Hey all, I\'m having a lot of difficulty with higher-order functions. When I use array.filter, I\'m not gettting the return I\'m expecting. #javascript,functions,arrays"';
    var ansResponse = 'Thanks for asking! To answer a question, you use the / command /sflowa\nWhen a question gets asked, I will respond with the question ID. You can answer a question with the following format: bodyOfYourAnswer #questionId.\nLike so: "When you filter an array, remember to return what\'s inside the callback function. The filter returns elements that match the true value of the callback. #189"\nThen I\'ll respond with confirmation your answer has been posted.';
    var fullResponse = 'Thanks for asking! To use my service, you can use two slash commands.\n/sflowq will tell me to post a question.\n/sflowa will tell me to post an answer.\nThe format for a question is [bodyOfYourQuestion #tags,tags]. \nWhen a question gets asked, I will respond with the question ID. You can answer a question with the following format: "bodyOfYourAnswer #questionId."\nThen I\'ll respond with confirmation your answer has been posted. Thanks for using Slack Overflow!\nTo post a resource, post just like a question and give it the "resource" tag.';
    var instResponse = 'Howdy! You can ask me the following questions for more info: "How do I post a question on Slack Overflow?", "How do I post an answer on Slack Overflow?" and "How do I use Slack Overflow?"';
    if (text) {
      if (text.includes('how') && text.includes('post') && text.includes('overflow') && text.includes('question')) {
        rtm.sendMessage(quesResponse, channel, function messageSent() {
          console.log ('Question response sent!');
        });
      } else if (text.includes('how') && text.includes('post') && text.includes('overflow') && text.includes('answer')) {
        rtm.sendMessage(ansResponse, channel, function messageSent() {
          console.log('Answer response sent!');
        });
      } else if (text.includes('how') && text.includes('use') && text.includes('overflow')) {
        rtm.sendMessage(fullResponse, channel, function messageSent() {
          console.log('Full response sent!');
        });
      } else if (text.includes('hey slack overflow')) {
        rtm.sendMessage(instResponse, channel, function(messageSent) {
          console.log('Instructions sent!');
        });
      }
    }
  });

  rtm.on(RTM_EVENTS.CHANNEL_CREATED, function(message) {
    var text = message.text;
    text = text.toLowerCase();
    var channel = message.channel;
    var introMessage = 'Hey there! You can type "Hey Slack Overflow" at any time to get more instructions on using the service!';
    rtm.sendMessage(introMessage, channel, function messageSent() {
      console.log('Intro message sent on new channel creation!');
    });
  });

  var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
}

module.exports = runSlackBot;
