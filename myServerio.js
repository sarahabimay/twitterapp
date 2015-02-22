var http = require( 'http' );
//server = http.createServer(myHandler),

var server = require('http').createServer( serverHandler );
var io = require('socket.io')(server);

var fs = require('fs');
var path = require( 'path' );
var twitterClient =  require( './twitterClientio');
var ecstatic = require( 'ecstatic')({root: __dirname + '/public'});
var myPort = process.env.PORT || 3000;
var filePath;

function serverHandler  (req, res) {
	console.log( "CONNECTION RECEIVED");
    //if only URL root path is received then load the 'homepage'
    // if( req.url === '/' ) {
    //   filePath = path.join( __dirname , "./public/indexio.html" );
    //   fs.readFile( filePath, function( err, data) {
    //         if (err) console.log(err);
    //         res.writeHead(200, {'Content-Type': 'text/html'});
    //         res.write(data);
    //         res.end();
    //   });
    // }
    // if request is for obtaining tweets:
   // else if ( req.url.match( /gettweets/ ) ) {

    // otherwise look for file in ./public directory and read from there useing ecstatic
    // else {
      ecstatic( req, res ) ;
    // };

    io.on('connection', function (socket) {
    	console.log('client connected via socket');
	
		socket.on( 'search', function( queryValue ) {
			console.log( 'Search Value:' + queryValue.query );
			console.log( 'emit tweet call')
			socket.emit('verify', { hello: 'world' });
	      	twitterClient.requestHandler( queryValue, res, socket );
      	});
	});

};

server.listen(myPort);


module.exports = {
	start: function() {
		// var server = require('http').createServer( serverHandler ).listen(3000);
		// var io = require('socket.io')(server);
		//server.listen(3000);
		//server.serverhandler(req, res);  
	}
};
