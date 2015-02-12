
function boilwater( callback ) {
	var water = 'hot';
	setTimeout( function() {
		water = 'hot';
		callback( water );
	}, 5000 );

};
exports.boilwater = boilwater;

