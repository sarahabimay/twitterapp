var Twitter = require( 'twitter');
var apiConfig = require( './config.json');
var url = require( 'url');

var client = new Twitter({
  consumer_key: apiConfig.cKey,
  consumer_secret: apiConfig.cSecret,
  access_token_key: apiConfig.atKey,
  access_token_secret: apiConfig.atSecret,
});

function queryPrefix(){
	return 'search/tweets.json';
	//return 'statuses/filter.json';
};

module.exports = {
	requestHandler: function( req, res ) {
		var jsonStr;
		var reqURL = url.parse( req.url, true );
		
	    // console.log( "URL: " + req.url );
	    console.log( "in twitterClient.requestHandler" );
		client.get( queryPrefix(), { q : reqURL.query.query }, function(error, tweets, response){
		    // console.log( "Tweets Count: " + tweets.statuses.length );
		    jsonStr = JSON.stringify( tweets.statuses.map( function(tweet) {
		      //console.log( tweet.text );
		      return { 'text': tweet.text };
		    }));
		    res.writeHead( 200, {'Content-Type': 'application/json'});
		    res.end( jsonStr );
		    if (!error) {
		      console.log(tweets.statuses[0]);
		    };
	    });


		/*console.log( 'ReqURL: ' + reqURL.query.query );
	    client.stream( 'statuses/filter.json', {track : reqURL.query.query }, function(stream) {
		    res.writeHead( 200, {'Content-Type': 'text/plain' } );

			stream.on('data', function(tweet) {
		    	console.log(tweet.text);	
		    	res.write( tweet.text );
		  	});
	    console.log( stream );
		 //stream.pipe( res );
		  stream.on('error', function(error) {
		  	console.log( 'error');
		    throw error;
		  });
		});*/
	}
};
//exports.requestHandler = requestHandler;