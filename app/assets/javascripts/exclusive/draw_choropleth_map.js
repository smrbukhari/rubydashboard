//console.log("calling part");
var mapboxAccessToken = 'pk.eyJ1Ijoic21yYnVraGFyaSIsImEiOiJjaXlmaXhzb3cwMHNtMnFvZTVreGI4ZTg0In0.5D_IDLbhhOs8axZhyRWZ3w';
var map = L.map('map').setView([37.8, -96], 4);
var vendors = [
  {id: 3, name: 'Ericsson'},
  {id: 7, name: 'Nokia'},
  {id: 13, name: 'Samsung'}
]
var colors =  [
 {id:3 , color_code: '#800026'},
 {id:7 , color_code: '#BD0026'},
 {id:13 , color_code: '#E31A1C'},
 {id:10 , color_code: '#FC4E2A'},
 {id:20 , color_code: '#FD8D3C'},
 {id:16 , color_code: '#FED976'},
 {id:23 , color_code: '#FFEDA0'},

]
function getColor(d) {
  console.log(d);
  var ids = []
  var sum;
  var selectedColor;
  vendors.forEach(function(vendor) {
    if(d.includes(vendor.name)){
      ids.push(vendor.id)
    }
    sum = ids.reduce(function(acc, val) { return acc + val; });
    colors.forEach(function(color) {
      if(color.id === sum){
       selectedColor = color;
      }

      return selectedColor;
    })
  });
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
  }).addTo(map);

function style(feature) {
  console.log(feature);
  return {
    fillColor: getColor(feature.vendor), //Based on the value in your data
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
  //console.log(props);
  this._div.innerHTML = '<h4>Vendor per State</h4>' +  (props ?
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
