# Slack Overflow
A collaborative Q/A forum for cohorts of coding bootcamps.

Deployed to http://slackoverflowapp.herokuapp.com but must be a Galvanize member to login.

![Screenshot of Slack-Overflow site.](https://raw.githubusercontent.com/dsudia/slack-overflow/master/slack-overflow-forum-shot.png)
![Screenshot of Slack chat using bot and / commands.](https://raw.githubusercontent.com/dsudia/slack-overflow/master/slack-overflow-slack-shot.png)

## Project Description
Slack Overflow is an app that allows cohort members (instructors/students) to communicate better. Students can post questions and others can post answers. The app receives questions and answers two ways. First via traditional forum interfaces; second by pulling posts from Slack channels. Students can interact with a Slack bot to ask questions on how to use the service.


### Who uses it?
Coding bootcamps run the app for their entire program. In the traditional interface Slack Overflow authenticates users as bootcamp members. The app detects users/cohorts on Slack and posts in the matching board.  Students use it to ask and answer questions about class topics. Instructors use it to check understanding, and answer questions when appropriate.


### What outputs do they need?
Users need to see pages that have a question and submitted answers that match that question. Users need to be able to sort questions by:
* cohort
* assignment/learning experience
* github repo
* topic
* keywords
* error codes?
* inner text
Users can see which answers have been up-voted the most by other users.


### What inputs are needed to generate those outputs?
The app needs the following inputs:

* User profile information including

  * First Name

  * Last Name

  * Cohort ID

  * username

  * password

  * slack Id

* User login information to authenticate users.

  * OAuth with Slack

  * OAuth with Github

* Method for posting questions through traditional interface

* Method for posting answers to a question through traditional interface

* Method for retrieving Q's and A's from Slack Channels

  * via / commands

  * System for writing Slack posts for the app to retrieve using # symbols

* Method for parsing retrieved Slack messages and treating them like traditional posts

### Technologies to be used
Slack Overflow will use the following technologies:

Front-End:

* JavaScript

* HTML5

* CSS3

* JQuery/AJAX

Back-End:

* Node.js

* Express.js

* PostgreSQL

* Passport

* cookies

* swig

* more???

### Feature list

* Questions can be sorted by vote, frequency, newest, activity, unanswered

* Users can post questions/answers through the website or Slack

* When user posts question through slack, it responds to the channel with some identifier for that question so people can tag answers for that question, and a link to the question's page that will open in a browser.

* Users can sort questions

* Users can search questions

* Instructors can remove questions/answers

* Instructors can flag duplicate questions

* Users can subscribe to a question and get notification through slack
