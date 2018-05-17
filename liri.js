//Liri bot for command line - made with node js
require("dotenv").config();

var keys = require("./keys");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify)

//variable for multiple word movie or song title inputs
var nodeArgs = process.argv;
//variable for the first param - command
var command = process.argv[2];
// Create an empty variable for holding the title param
var title = "";
//for loop to chain together multiple word inputs and store them in the title variable
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    title = title + " " + nodeArgs[i];
  }
  else {
    title += nodeArgs[i];
  }
};

console.log(title);

//create a switch statement to call the different functions depending on the input params
switch(command) {
    //tweets
    case "my-tweets":
    displayTweets();
    break;
    //spotify
    case "spotify-this-song":
    if(title) {
        spotifySong(title);
    } else {
        spotifySong("Moonlight Mile");
    }
    break;
    //movie database
    case "movie-this":
    if(title) {
        searchMovie(title)
    } else {
        searchMovie("Mr. Nobody")
    }
    break;
    //do what the txt file says
    case "do-what-it-says":
    doThis();
    break;
    //default situation with no input
    default:
    console.log("Enter one of the following commands:");
    console.log("my-tweets, spotify-this-song, movie-this, do-what-it-says");
}

function displayTweets(){
    //Display last 20 Tweets
    var screenName = {screen_name: 'nikoale96003558'};
    client.get('statuses/user_timeline', screenName, function(error, tweets, response){
      if(!error){
        for(var i = 0; i < tweets.length; i++){
          var date = tweets[i].created_at;
          console.log("\nnikoalexander: " + tweets[i].text + " Created At: " + date.substring(0, 19));
          console.log("=======*=======*=======*=====*====")
        }
      }else{
        console.log('An error occurred');
      }
    });
  }

  function spotifySong(song){
    spotify.search({ type: 'track', query: song}, function(error, data){
      if(!error){
        for(var i = 0; i < data.tracks.items.length; i++){
          var songData = data.tracks.items[i];
          //artist
          console.log("Artist: " + songData.artists[0].name);
          //song name
          console.log("Song: " + songData.name);
          //spotify preview link
          console.log("Preview URL: " + songData.preview_url);
          //album name
          console.log("Album: " + songData.album.name);
          console.log("-----------------------");
        }
      } else{
        console.log('An error occurred.');
      }
    });
  }

  function searchMovie(movieTitle) {

      var queryURL = "http://www.omdbapi.com?apikey=3b8b5dd8&t=" + movieTitle //omdb query url with api key

      request(queryURL, function(err, res, body) {
        if(!err && res.statusCode === 200) {
            console.log(JSON.parse(body));
        }
      });
  }