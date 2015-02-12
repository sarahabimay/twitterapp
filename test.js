var test = require( 'tape');
var maketea = require( './forTest.js' );

test( 'boil the water', function( t) {
	var water = maketea.boilwater( function( water ) {
		t.plan( 1 );
		t.equal( water, "hot", 'Kettle is boiled');
	});
})