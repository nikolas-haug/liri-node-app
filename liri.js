//Liri bot for command line - made with node js

//configure the .env file with api keys and secrets
require("dotenv").config();

var keys = require("./keys");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
//for pretty json - to alter the appearance of the terminal
var prettyjson = require("prettyjson");

//empty variable for multiple word movie or song title inputs
var nodeArgs = process.argv;
//variable for the first param - command
var command = process.argv[2];
// Create an empty variable for holding the nodeArgs params
// var title = "";
// for loop to chain together multiple word inputs and store them in the title variable
// for (var i = 3; i < nodeArgs.length; i++) {
//     if (i > 3 && i < nodeArgs.length) {
//             title = title + " " + nodeArgs[i];
//     } else {
//             title += nodeArgs[i];
//     }
// };

var title = process.argv.slice(3).join(' ');

// console.log(title);

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
    console.log("\n===========================================================");
    console.log("Enter one of the following commands for liri:");
    console.log("*my-tweets  *spotify-this-song  *movie-this  *do-what-it-says");
    console.log("===========================================================\n")

}

function displayTweets() { 
    var screenName = {screen_name: 'nikoale96003558'};
        client.get('statuses/user_timeline', screenName, function(error, tweets, response){
            if(!error){

            console.log("===============================")
            console.log("recent tweets by: nikoalexander")
            console.log("===============================\n")

            for(var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                var data = {
                    tweet: tweets[i].text,
                    written: date.substring(0, 16)
                }
                    console.log(prettyjson.render(data, {
                        keysColor: 'green',
                        dashColor: 'magenta',
                        stringColor: 'white'
                    }));
                    console.log("\n")    
            }
            console.log("===============================")
        } else {
            console.log('An error occurred');
        } 
    });
}

function spotifySong(song) {
    spotify.search({ type: 'track', query: song}, function(error, data) {
        if(!error){
            console.log("\n---------------------------------");
            console.log("          SEARCH RESULTS           ");
            console.log("---------------------------------")
            for(var i = 0; i < data.tracks.items.length; i++){
            var songData = data.tracks.items[i];
            //make a song data object for various categories
            var songObject = {
                artist: songData.artists[0].name,
                song: songData.name,
                URL: songData.preview_url,
                album: songData.album.name
            }
            console.log(prettyjson.render(songObject, {
                keysColor: 'green',
                dashColor: 'magenta',
                stringColor: 'white'
            }));
            console.log("-----------------------");
            }
        } else {
            console.log('An error occurred.');
        }
    });
}

  function searchMovie(movieTitle) {
    //omdb query url with api key
    var queryURL = "http://www.omdbapi.com?apikey=3b8b5dd8&t=" + movieTitle

    request(queryURL, function(err, res, body) {
        if(!err && res.statusCode === 200) {
            //prettyjson
            var data = {
                title: JSON.parse(body).Title,
                year: JSON.parse(body).Year,
                IMDB: JSON.parse(body).Ratings[0].Value,
                "rotten tomatoes": JSON.parse(body).Ratings[1].Value,
                "filmed in": JSON.parse(body).Country,
                language: JSON.parse(body).Language,
                plot: JSON.parse(body).Plot,
                actors: JSON.parse(body).Actors
            }
            console.log("\n===================================================")
            console.log("                " + JSON.parse(body).Title)
            console.log("===================================================")
            console.log(prettyjson.render(data, {
                keysColor: 'green',
                dashColor: 'magenta',
                stringColor: 'white'
                }));
            console.log("=====================================================\n")
            }
      });
  }

  function doThis() {
    fs.readFile('random.txt', "utf8", function(error, data) {
      var txt = data.split(',');
      spotifySong(txt[1]);
    });
  }