/**
 * 
 */
require.config({
	paths:{
		'jquery':'libs/jquery',
		'leaflet':'http://cdn.leafletjs.com/leaflet-0.6.4/leaflet',
        'jqueryui':'http://code.jquery.com/ui/1.11.1/jquery-ui.min'
	}
});
require(['modules/tosplit'], function(person){
	
	console.log(person);
});