/**
 * 
 */
require.config({
	paths:{
		'jquery':'libs/jquery',
		'leaflet':'http://cdn.leafletjs.com/leaflet-0.6.4/leaflet'
	}
});
require(['modules/tosplit'], function(person){
	
	console.log(person);
});