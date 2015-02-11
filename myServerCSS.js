var http = require( 'http' );
var fs = require('fs');
var Twitter = require( 'twitter');
var url = require( 'url');
var path = require( 'path' );
var apiConfig = require( './config.json');

var ecstatic = require( 'ecstatic')({root: __dirname + '/public'});
/*if( '/')
else ecstatic( request, response );
*/
var client = new Twitter({
  consumer_key: apiConfig.cKey,
  consumer_secret: apiConfig.cSecret,
  access_token_key: apiConfig.atKey,
  access_token_secret: apiConfig.atSecret,
});
var reqURL;
var queryURL;
var filePath;
var jsonStr;

http.createServer(function (req, res) {

    reqURL = url.parse( req.url, true );
  
    // if only URL root path is received then load the 'homepage'
    if( req.url === '/' ) {
      filePath = path.join( __dirname , "index.html" );
      fs.readFile( filePath, function( err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
      });
    }
    // if request is for obtaining tweets:
    else if ( req.url.match( /gettweets/ )) {
      queryURL = 'search/tweets.json?q=' + reqURL.query.query;//+urlObj.query.query;
      

      client.get( queryURL, function(error, tweets, response){
       // console.log( "Tweets Count: " + tweets.statuses.length );
        jsonStr = JSON.stringify( tweets.statuses.map( function(tweet) {
          //console.log( tweet.text );
          return { 'text': tweet.text };
        }));
        //console.log( 'JSON STRING: ' + jsonStr );
        res.writeHead( 200, {'Content-Type': 'application/json'});
        res.write( jsonStr );
        res.end();
        if (!error) {
          console.log(tweets);
        };
      });
    }
    // otherwise look for file in ./public directory and read from there useing ecstatic
    else {
      ecstatic( req, res ) ;
    };

}).listen( 3000 );

console.log('Server up and running' );
