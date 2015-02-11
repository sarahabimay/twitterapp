$(document).ready( function (){
	$('#searchvalue').focus( function(){
        $(this).val('');
    });
	// send a GET request to my web server
	$('#search').click( function() {
		var resultHTML;
		$.get('./gettweets?query='+$('#searchvalue').val())
		.done(function(data){
			console.log( "In done callback. Data: " + data );
			resultHTML = data.map( function( element, index ){
				return '<p>' + element.text + '</p>'
			})
			$('#results').html(resultHTML.join("") );
		});
	});
});