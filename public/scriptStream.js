$(document).ready( function (){
	$('#searchvalue').focus( function(){
        $(this).val('');
    });
	// send a GET request to my web server
	
	$('#search').click( function() {
		//var resultHTML;
		var rawResultsArray = [];

		console.log( 'Generate GET request for: ' + $('#searchvalue').val());

		var request;	
    	if (window.XMLHttpRequest) {
        	// code for IE7+, Firefox, Chrome, Opera, Safari
       	 request = new XMLHttpRequest();
       	 request.responseType = 'stream';
   		} else {
    	    // code for IE6, IE5
        	request = new ActiveXObject("Microsoft.XMLHTTP");
    	}

    	request.open("GET", './gettweets?query=' + $('#searchvalue').val(), true);
    	request.send();

    	// callback function that will get called once request ready state changes
    	//  or: request.onload = function() {}
    	request.onreadystatechange = function() {  
    		//console.log( 'Request: ' + request );
    		//console.log ("In onreadystatechange. " + request.responseText ); 
    		var resultsAreaElem; 		
    		if ( request.readyState === 3 ) {
            	if( request.status === 200){	
	            	console.log ("In onreadystatechange. " + request.responseText );
	            	// console.log ("Tweet Text: " + request.responseText.text );
	            	console.log ("Type: " + typeof request.responseText );

	            	var data = JSON.parse( request.responseText.text );
	            	console.log(data);
	            	// console.log ("In onreadystatechange. Text: " + data.text );
	            	// console.log ("In onreadystatechange. MEDIA: " + data.media_url);
	            	// console.log ("In onreadystatechange. URL: " + data.url );      
	            	

	            	// if array is full then pop off the last value
	            	if( rawResultsArray.length === 10 ){
	            		console.log( 'RawResultsArray size is 10');
	            		rawResultsArray.pop();            		
	            		// remove last child from resultsarea
	   					resultsAreaElem = document.getElementById( 'resultsarea');
	   					console.log( 'Results area: ' + resultsAreaElem );
	   					resultsAreaElem.removeChild( resultsAreaElem.lastChild );
	            	};
	            	// if array is not full then push on the beginning
	            	// if array is now too big then pop off elements until size is 10
	            	var countAfterUnshift = rawResultsArray.unshift( data );
	            	console.log( 'RawResultsArray: ' + rawResultsArray + ', size: ' + countAfterUnshift );

	            	while( countAfterUnshift > 10 ) {
	            		console.log( 'RawResultsArray size should be 10, it is: ' + countAfterUnshift );
	            		resultsAreaElem = document.getElementById( 'resultsarea');
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
            	};
            };
    	};


		/*$.get('./gettweets?query=' + $('#searchvalue').val() )
		.done(function(data){
			console.log( "In done callback. Data: " + data );
			resultHTML = data.map( function( element, index ){
				return '<li>' + element.text + '</li>'
			})
			$('#results').html(resultHTML.join("") );
		});*/
	});
});

function formatTextForHTML ( newTweet ){
	console.log( 'In formatTextForHTML');
	if (newTweet.url === undefined )
		return '<p class="tweettext">' + newTweet.text + '</p>';
	else {
		return "<p class='tweettext'> <a class='tweetlink' href="+ newTweet.url + ">" + newTweet.text + "</a></p>";
	}
}
function formatMediaForHTML (mediaUrl){
	console.log( 'In formatMediaForHTML');
	return '<div class="mediadiv"> ' + '<img class="mediapic" src=' + mediaUrl + ' alt="Cannot display image"></div>';
}

function formatTweetToHTML (newTweet) {
	console.log( 'In formatTweetToHTML');
	var textandlink, media_url, htmlData;
	/* loop through each tweet, and put into this format:
		<div class='tweetdiv'>
			<p class='tweettext'> 
				<a class='tweetlink' href=data.url>data.text</a>
			</p>
			<div class="mediadiv" > 
				<img class="mediapic" src=mediaUrl alt="Cannot display image">
			</div>
		</div>
	*/
	// formatTextForHTML
	textandlink = formatTextForHTML( newTweet );
	// if media_url available then include in html
	if (newTweet.media_url !== undefined )
		media_url = formatMediaForHTML( newTweet.media_url);	

	htmlData = '<div class="tweetdiv">' + textandlink + media_url + '</div>';

	console.log( "HTML to be appended: " + htmlData );
	return htmlData;
}

function insertNewTweetToHTML( newTweet ) {
	
	console.log( 'In insertNewTweetToHTML');
	var htmlTweet = formatTweetToHTML(newTweet);
	// document.getElementById('resultsarea').prepend( htmlTweet );
	$('#resultsarea').prepend(htmlTweet);
}