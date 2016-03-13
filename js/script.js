var basemapUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
var attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
var geojson;

//initial content in information window
$('#infoWindow').html('Information Window<br />Updates as you hover over a tract');

//initialize map1
var map1 = L.map('map1', {
scrollWheelZoom: true
}).setView([40.739061, -73.952654], 11);

//CartoDB Basemap
L.tileLayer(basemapUrl,{
	attribution: attribution
}).addTo(map1);

//this function takes a value and returns a color based on which bucket the value falls between
function getColor(d) {
  return d > 90 ? '#542788' :
         d > 70 ? '#2166ac' :
         d > 50 ? '#92c5de' :
         d > 30 ? '#f4a582' :
         d > 10 ? '#d7191c' :
                  '#a50f15';
}

//select correct column from dataset when appropriate button is clicked
var redi_column = 'redi_nor_1'; // initially shows equal weigths REDI score

$("#eqWeight").click(function(){
  redi_column = 'redi_nor_1';
  //geojson.resetStyle();
});
$("#catSum").click(function(){
  redi_column = 'redi_pct_1';
  //geojson.resetStyle();
});
$("#socInf").click(function(){
  redi_column = 'socredno_1';
  //geojson.resetStyle();
});
$("#phyInf").click(function(){
  redi_column = 'infredno_1';
  //geojson.resetStyle();
});
$("#envCond").click(function(){
  redi_column = 'envredno_1';
  //geojson.resetStyle();
});
$("#econStr").click(function(){
  redi_column = 'ecoredno_1';
  //geojson.resetStyle();
});

//this function returns a style object, but dynamically sets fillColor based on the data
function style(feature) {
return {
    fillColor: getColor(feature.properties[redi_column]),
    weight: 1,
    opacity: 0.5,
    color: '',
    dashArray: '',
    fillOpacity: 1
};
}

//this function is set to run when a user mouses over any polygon
function mouseoverFunction(e) {
var layer = e.target;

layer.setStyle({
    weight: 3,
    color: 'blue',
    dashArray: '',
    fillOpacity: 1
});

if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
}

//update the text in the infowindow with whatever was in the data
//console.log(layer.feature.properties.NTAName);
$('#infoWindow').html(layer.feature.properties.NTAName+'<br />REDI Score: '+Math.round(layer.feature.properties[redi_column]));

}

//this runs on mouseout
function resetHighlight(e) {
	geojson.resetStyle(e.target);
}

//this is executed once for each feature in the data, and adds listeners
function onEachFeature(feature, layer) {
	layer.on({
	    mouseover: mouseoverFunction,
	    mouseout: resetHighlight
	    //click: zoomToFeature
	});
}

//be sure to specify style and onEachFeature options when calling L.geoJson().
$.getJSON('data/redi.geojson', function(redi_data) {
	geojson = L.geoJson(redi_data,{
	  style: style,
	  onEachFeature: onEachFeature
	}).addTo(map1);
});

// map1.setZoom(9);