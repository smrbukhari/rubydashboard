//console.log("calling part");
var mapboxAccessToken = 'pk.eyJ1Ijoic21yYnVraGFyaSIsImEiOiJjaXlmaXhzb3cwMHNtMnFvZTVreGI4ZTg0In0.5D_IDLbhhOs8axZhyRWZ3w';
var map = L.map('map').setView([37.8, -96], 4);

function getColor(d) {
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0'; //You pick your own colors using say CSS Color Wheel etc
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
  }).addTo(map);

function style(feature) {
  return {
    fillColor: getColor(feature.properties.density), //Based on the value in your data
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

//L.geoJson(statesData, {style: style}).addTo(map);
//L.geoJson(statesData).addTo(map);
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}
var geojson;
var info = L.control();
info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
//  console.log(this);
  return this._div;
};
// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  console.log(props);
  this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
      '<b>' + props.name + '</b><br />' + props.vendor : 'Hover over a state');
};

info.addTo(map);

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
 var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
  return div;
};

legend.addTo(map);
var geojson;
geojson = L.geoJson(BiSquare.statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
