var mymap;

function rem_map() {
  mymap = null;
};

function geo_function() {
  var isdragtrue = false;
  //ajax
  $.ajax({
    url: "/plotly_map_api",
    type: "get",
    datatype: "json",
    //data: JSON.stringify(data),
    //headers: {"content-type": "application/json"},
    success: function (response) {
      var applicant = [];
      var longitude = [];
      var latitude = [];
      var startlat = [];
      var endlat = [];
      var startlong = [];
      var endlong = [];
      var san_fran = new L.LatLng(37.7739, -122.4312)

      //  alert ("success")
      post_data = response.data[0];
      for (i = 0; i < response.data[0].length; i++)
      {
        applicant.push(post_data[i].applicant);
        latitude.push(post_data[i].latitude);
        longitude.push(post_data[i].longitude);
        //cpu_util.push(response.data[i].cpu_util);
        //date_time.push(response.data[i].date_time);
        //alert(response.data[i].latitude[i]);
      }
      //alert(longitude[0]);
      mymap = L.map('mapid').setView([37.7739, -122.4312], 12);
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1Ijoic21yYnVraGFyaSIsImEiOiJjaXlmaXhzb3cwMHNtMnFvZTVreGI4ZTg0In0.5D_IDLbhhOs8axZhyRWZ3w'}).addTo(mymap);

      // routine to draw rectangle on drag
      var draw = false;
      var button_selected = false;
      var rect = null;
      var mouse = {
        startX: 0.0,
        startY: 0.0
      };

      mymap.on('mousemove', function (e) {
        if(draw == true){
          console.log('mousemove');
          var let = e.latlng.lat;
          var lng = e.latlng.lng;
          if (rect != null){
            mymap.removeLayer(rect);
          }
          $('#mapid').css('cursor','crosshair');
          var bounds = [[mouse.startX, mouse.startY], [let, lng]];
          rect = L.rectangle(bounds, {color: "#ff7800", weight: 1});
          rect.addTo(mymap);
          console.log(let + " " + lng)
        }
      });

      mymap.on('mousedown', function (e) {
        if (rect != null){
          mymap.removeLayer(rect);
        }
        mouse.startX = e.latlng.lat;
        mouse.startY = e.latlng.lng;

        if (button_selected == true){ //t avoid drawing with dragging
          draw = true;
        }
      });

      mymap.on('mouseup', function (e) {
        draw = false;
        $('#mapid').css('cursor','');
      });

      for (k = 0; k < latitude.length; k++)
      {
        var geojsonFeature = {
          "type": "Feature",
          "properties": {
              "name": "Coors Field",
              "amenity": "Baseball Stadium"
            },
          "geometry": {
              "type": "Point",
              "coordinates": [longitude[k], latitude[k]] //longitude first
           }
        };

        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
        };

        L.geoJSON(geojsonFeature, {
          pointToLayer: function (feature, latlng)
          {
            var popupContent = "applicant:" + applicant[k];
            var popupOptions = {maxWidth: 200};
            var circle_marker =  L.circleMarker(latlng, geojsonMarkerOptions).bindPopup(popupContent,popupOptions);
            circle_marker.on('mouseover',  function (e) { //e passes current mouse position
              this.openPopup();
            });
            circle_marker.on('mouseout',  function (e) {
              this.closePopup();
            });
            return circle_marker;
          }
        }).addTo(mymap);
      } //closing - for loop

      L.easyButton( 'glyphicon glyphicon-home', function(){
        //alert('you just clicked a glyphicon');
        if (isdragtrue == true) {
          mymap.dragging.disable();
          isdragtrue = false;
          button_selected = true;
        } else {
          mymap.dragging.enable();
          isdragtrue = true;
          button_selected = false;
          //console.log(mymap.dragging.enable());
        } //close else
      }).addTo(mymap);
    }, //success closing
  });// ajax closing
}; //function close
