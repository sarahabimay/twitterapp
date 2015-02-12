var http = require( 'http' );
var fs = require('fs');
var path = require( 'path' );
var twitterClient =  require( './twitterClient')
var ecstatic = require( 'ecstatic')({root: __dirname + '/public'});

var filePath;

module.exports = {
	start: function() {
		
		http.createServer(function (req, res) {

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
		      twitterClient.requestHandler( req, res );
		    }
		    // otherwise look for file in ./public directory and read from there useing ecstatic
		    else {
		      ecstatic( req, res ) ;
		    };

		}).listen( 3000 ); // app.set( 'port', (process.env.PORT || 3000 ) )
	}
};