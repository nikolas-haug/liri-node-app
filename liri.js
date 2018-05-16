require("dotenv").config();

var keys = require("./keys");
var request = require("request");
var Twitter = require("twitter");
var client = new Twitter(keys.twitter);

var param1 = process.argv[2];
var param2 = process.argv[3];

function showTweets(){
    //Display last 20 Tweets
    var screenName = {screen_name: 'nikoale96003558'};
    client.get('statuses/user_timeline', screenName, function(error, tweets, response){
      if(!error){
        for(var i = 0; i <tweets.length; i++){
          var date = tweets[i].created_at;
          console.log("nikoalexander: " + tweets[i].text + " Created At: " + date.substring(0, 19));
          console.log("-----------------------");
        }
      }else{
        console.log('An error occurred');
      }
    });
  }

  showTweets();