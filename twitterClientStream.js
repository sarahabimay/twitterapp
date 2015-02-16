var Twitter = require( 'twitter');
var apiConfig = require( './config.json');
var url = require( 'url');

var client = new Twitter({
  consumer_key: apiConfig.cKey,
  consumer_secret: apiConfig.cSecret,
  access_token_key: apiConfig.atKey,
  access_token_secret: apiConfig.atSecret,
});
var currentTwitStream;

function queryPrefix(){
	//return 'search/tweets.json';
	return 'statuses/filter.json';
};

module.exports = {
	requestHandler: function( req, res ) {
		var jsonStr;
		var reqURL = url.parse( req.url, true );
		
	    // console.log( "URL: " + req.url );
	    console.log( "in twitterClient.requestHandler" );
		/*client.get( queryPrefix(), { q : reqURL.query.query }, function(error, tweets, response){
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
	    });*/
		
		if (currentTwitStream) currentTwitStream.destroy();

	    client.stream ( 'statuses/filter.json', {track : reqURL.query.query }, function (stream) {
		    
		    res.writeHead( 200, {'Content-Type': 'application/json' } );
		    console.log( stream );
		    
			currentTwitStream = stream;	
		
			stream.on('data', function(tweet) {
		    	//console.log( 'twitter stream json?: ' + tweet.entities );	
		     	var returnString = { 'text': tweet.text };

		    	if( typeof (tweet.entities.media) !== 'undefined' && tweet.entities.media[0]) {
		    		console.log( 'tweet pic: ' + tweet.entities.media[0].media_url );
		    		returnString.media_url = tweet.entities.media[0].media_url;
		    	};
		    	if (tweet.entities.urls[0]) {
		    		console.log( 'tweet link: ' + tweet.entities.urls[0].url );
		    		returnString.url = tweet.entities.urls[0].url;
	    		};
	    		console.log( 'Stream ReturnString: ' + JSON.stringify( returnString ));
		    	res.write( JSON.stringify(returnString) );
		  	});
	    	
		 	//stream.pipe( res );
		 	stream.on( 'end', function( response ) {
		 		console.log( 'In twitter stream end, end the response stream');
	 			res.end();
		 	});


		  	stream.on('error', function(error) {
		  		console.log( 'error');
		    	throw error;
		  });
		});
	}
};