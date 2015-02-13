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
	requestHandler: function( queryValue, res, socket ) {
		var jsonStr;
	    console.log( "in twitterClient.requestHandler" );
		
		if (currentTwitStream) currentTwitStream.destroy();

	    client.stream ( 'statuses/filter.json', {track : queryValue.query, lang: queryValue.lang, result_type: queryValue.result_type }, function (stream) {
		    
		    console.log( stream );
		    
			currentTwitStream = stream;	
		
			stream.on('data', function(tweet) {
		     	var returnString = { 'text': tweet.text };

		    	if ( typeof (tweet.entities.media) !== 'undefined' && tweet.entities.media[0]) {
		    		console.log( 'TWEET HAS A PICTURE: ' + tweet.entities.media[0].media_url );
		    		returnString.media_url = tweet.entities.media[0].media_url;
		    	};
		    	if (tweet.entities.urls[0]) {
		    		console.log( 'TWEET HAS A LINK: ' + tweet.entities.urls[0].url );
		    		returnString.url = tweet.entities.urls[0].url;
	    		};
	    		console.log( 'Stream ReturnString: ' + JSON.stringify( returnString ));
	    		socket.emit( 'tweet', returnString );
		  	});
	    	
		 	stream.on( 'end', function( response ) {
		 		console.log( 'STREAM ENDED!!! In twitter stream end, end the response stream');
		 	});


		  	stream.on('error', function(error) {
		  		console.log( 'error');
		    	throw error;
		  });
		});
	}
};