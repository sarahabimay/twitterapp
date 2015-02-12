$(document).ready( function (){
	$('#searchvalue').focus( function(){
        $(this).val('');
    });
	// send a GET request to my web server
	$('#search').click( function() {
		var resultHTML;
		console.log( './gettweets?query='+$('#searchvalue').val());
		$.get('./gettweets?query=' + $('#searchvalue').val(), function( data ) {
			console.log( 'data: ' + data );
		})
		.done(function(data){
			console.log( "In done callback. Data: " + data );
			resultHTML = data.map( function( element, index ){
				return '<li>' + element.text + '</li>'
			})
			$('#results').html(resultHTML.join("") );
		});
	});
});