require('dotenv').config();
var request = require('request');

module.exports = function(str) {
  str = str.replace(/[^\w\s]/gi, '');
  str = str.replace(/ /g,"%20");
  str = str.replace(/\n/g, "%20");

  return request.post("http://gateway-a.watsonplatform.net/calls/text/TextGetRankedKeywords?apikey=" + process.env.ALCHEMY_KEY + "&text=" + str + "&maxRetrieve=10&outputMode=json",
    function(err, res, body) {
      console.log(res.body);
      return res.body;
    });
};
