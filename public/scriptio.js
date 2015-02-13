


  $(document).ready( function (){
	
	$('#searchvalue').focus( function(){
        $(this).val('');
    });
	// send a GET request to my web server
	
	$('#search').click( function() {
		var rawResultsArray = [];
		var countAfterUnshift;
		var resultsAreaElem = document.getElementById('resultsarea');
		// clear resultsarea of all elements
		$('#resultsarea').empty();

		console.log( 'Generate GET request for: ' + $('#searchvalue').val());

		var socket = io('http://localhost:3000');
  		
    	socket.emit('search', { query: $('#searchvalue').val(), 
    							lang: 'en',
    							result_type: 'recent' });
  
		socket.on( 'verify', function (data) {
			console.log( 'Socket reply from Server');
		});
  		socket.on('tweet', function (data) {
    		console.log( 'Server has sent a tweet' + data );
        	// if array is full then pop off the last value
        	if( rawResultsArray.length === 10 ){
        		console.log( 'RawResultsArray size is 10');
        		rawResultsArray.pop();            		
        		// remove last child from resultsarea
				console.log( 'Results area: ' + resultsAreaElem );
				resultsAreaElem.removeChild( resultsAreaElem.lastChild );
        	};
        	// if array is not full then push on the beginning
        	// if array is now too big then pop off elements until size is 10
        	countAfterUnshift = rawResultsArray.unshift( data );
        	
        	console.log( 'RawResultsArray: ' + rawResultsArray + ', size: ' + countAfterUnshift );
        	while( countAfterUnshift > 10 ) {
        		console.log( 'RawResultsArray size should be 10, it is: ' + countAfterUnshift );        		
				console.log( 'Results area: ' + resultsAreaElem );
				resultsAreaElem.removeChild( resultsAreaElem.lastChild );
        		rawResultsArray.pop();
        		countAfterUnshift = rawResultsArray.length; 
        	};

        	// check data is in the array
        	if( rawResultsArray.indexOf( data ) !== -1 ) {
        		console.log( 'Data is in the array');
        	}
        	else {
        		console.log( 'Data was not found in the array');
           	};

           	// pass the array to insertDataToHTML
           	insertNewTweetToHTML( data );
    	});

	});
});

function formatTextForHTML ( newTweet ){
	console.log( 'In formatTextForHTML');
	if (newTweet.url === undefined ) {
		return '<p class="tweettext">' + newTweet.text + '</p>';
	}
	else {
		return "<p class='tweettext'> <a class='tweetlink' href="+ newTweet.url + ">" + newTweet.text + "</a></p>";
	};
}
function formatMediaForHTML (mediaUrl){
	console.log( 'In formatMediaForHTML');
	return '<div class="mediadiv"> ' + '<img class="mediapic" src=' + mediaUrl + ' alt="Cannot display image"></div>';
}

function formatTweetToHTML (newTweet) {
	console.log( 'In formatTweetToHTML');
	var textandlink, media_url, htmlData;
	// formatTextForHTML
	textandlink = formatTextForHTML( newTweet );
	// if media_url available then include in html
	if (newTweet.media_url !== undefined ){
		media_url = formatMediaForHTML( newTweet.media_url);	
	};
	if( media_url === undefined ) {
		htmlData = '<div class="tweetdiv">' + textandlink + '</div>';
	}	 
	else {
		htmlData = '<div class="tweetdiv">' + textandlink + media_url + '</div>';
	};

	console.log( "HTML to be prepended: " + htmlData );
	return htmlData;
}

function insertNewTweetToHTML( newTweet ) {
	var htmlTweet = formatTweetToHTML(newTweet);
	$('#resultsarea').prepend(htmlTweet);
}