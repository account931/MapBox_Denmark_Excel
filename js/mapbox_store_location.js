var clickedCoords; //coords of clicked place, global to use in ajax to pass to /ajax_php_scripts/add_marker_php.php which uses logic is in /Classes/AddMarker.php
var map; //global to use in direction-api.js
var popuppZ; //global to use in direction-api.js, temporary and Dataset marker pop-up
var markerZ; //global var  to be able remove prev markers (in js/add_marker.js or js/delete_marker.js)
var markerZXX; //Dataset marker;
var gets_Dataset_features_from_API; //function to get Dataset markers values from Dataset //we use here Function Expression to pass the name of the function(declared here outside IIFE) to a different js script (js/add_marker.js)
var currentMarkers=[]; //array that contains all added markers, in order to be able to remove them
var scrollResults; //global Function to scroll to certain div, it is global & declared var out of IIFE to use in other scripts
var scroll_toTop;  //global Function to scroll the page to top, it is global & declared var out of IIFE to use in other scripts
var removeMarker_and_Popup; //global Function to remove any markers and pop-ups, it is global & declared var out of IIFE to use in other scripts


//object to hold geo data from Excel file {Geocoding_Process_Module/Slave_data.xlsx}, must be outside IIFE  to be seen in js/direction-api.js
var dataConvert = {type: "FeatureCollection",features:[]};


(function(){ //START IIFE (Immediately Invoked Function Expression)

$(document).ready(function(){
	
var DIRECTION_MODE = false;	 //mine, activated in checkbox switch top left
	
	
	
	
	
//Access api key is in Credentials/api_access_token!!!!
//Creats map with center
 map = new mapboxgl.Map({
container: 'map', // container id
center: window.START_POINT_from_SETTING, //var from 'start_point_js.js' //[12.592224, 55.679681], // starting position [lng, lat] 
zoom: 9, // starting zoom
style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
//style: 'mapbox://styles/mapbox/satellite-v9'
});


//Add MapBox Geocoder plug-in to map -> https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder/
map.addControl(
   new MapboxGeocoder({
      accessToken: mapboxgl.accessToken, //must-have
      mapboxgl: mapboxgl
    })
);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());



//Geolocation button control to add to map. It DOES NOT WORK as => Geolocation support for modern browsers including Chrome requires sites to be served over HTTPS.If geolocation support is not available, the GeolocateControl will not be visible.
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,  //If  true the Geolocate Control becomes a toggle button and when active the map will receive updates to the user's location as it changes. I.e monitors when user changes location
        //showUserLocation: true //by default it is true, show a dot where the user's location is
	}));
//END Geolocation button control to add to map




//Add Geocoder Search Bar without a map (it autocompletes any address in the world) -> https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder-no-map/
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    types: 'country,region,place,address,postcode,locality,neighborhood' //    types: 'country,region,place,address,postcode,locality,neighborhood'
});
 
geocoder.addTo('#geocoder');
//End Add Geocoder Search Bar without a map (it autocompletes any address in the world) -> https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder-no-map/





//Add  to map "Display driving directions", from A to B -> https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-directions/. HAS CSS CONFLICT WITH GEOCODER PLUG-IN
/*map.addControl(
    new MapboxDirections({
    accessToken: mapboxgl.accessToken
    }),
'top-left'
);
*/
//End Add "Display driving directions", from A to B -> https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-directions/






//hard-Coded hand-made markers object 
/*
var data = {
  type: 'FeatureCollection',
  features: [
      {
          type: 'Feature',
          geometry: {
          type: 'Point',
          coordinates: [12.592224, 55.679681]
          },
          properties: {
              title: 'Точка А (Отправка)',
               description: 'Copenhagen',
	           icon: {
                  iconUrl: 'https://www.mapbox.com/mapbox.js/assets/images/astronaut1.png',
                  iconSize: [50, 50], // size of the icon
                  iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
                  popupAnchor: [0, -25], // point from which the popup should open relative to the iconAnchor
                  className: 'dot'
               }
	  
          }
      },
      //end of marker 1
      
	    {
          type: 'Feature',
          geometry: {
          type: 'Point',
          coordinates: [12.304537, 55.931858]
          },
          properties: {
              title: 'Hovedstaden',
               description: 'Region 1',
          }
       },
      //end of marker 2
	  
	  {
          type: 'Feature',
          geometry: {
          type: 'Point',
          coordinates: [9.074350, 55.462001]
          },
          properties: {
              title: 'Syddanmark',
               description: 'Region 2',
          }
       },
      //end of marker 3
	  
	  {
          type: 'Feature',
          geometry: {
          type: 'Point',
          coordinates: [11.720648, 55.466004]  
          },
          properties: {
              title: 'Sjælland',
               description: 'Region 3',
          }
       },
      //end of marker 4
	  
	  {
          type: 'Feature',
          geometry: {
          type: 'Point',
          coordinates: [8.997792, 56.121592]  
          },
          properties: {
              title: 'Midtjylland',
               description: 'Region 4',
          }
       },
      //end of marker 4
	  
	  
	  {
          type: 'Feature',
          geometry: {
          type: 'Point',
          coordinates: [ 9.920132, 57.033170]  
          },
          properties: {
              title: 'Nordjylland',
               description: 'Region 5',
          }
       },
      //end of marker 5
	  
  
  ]
};

console.log(data);
*/


//ajax to get coords from Slave Excel file 
		$.ajax({
            url: 'ajax/getCoordsListFromSlaveExcel.php',//my ajax url 
            type: 'POST',
			dataType: 'JSON', // without this it returned string(that can be alerted), now it returns object
			//passing the city
            data: { 
			    //serverCity:window.cityX
			},
            success: function(data) {
				//alert('Loading markers from Excel file "/Slave_data.xlsx" was OK');
				swal("Success", "Loading markers from Excel file '/Slave_data.xlsx' was OK", "success");
				console.log(data);
				
				createObject_dataConvert(data.features); //converts ajax success result array from {ajax/getCoordsListFromSlaveExcel.php} to geojson-OK format object (to build markers)
				convert_Dataset_to_map(dataConvert);
				$('#gmaps').html('<a href="' + data.urlText + '">GM</a>');
				
            },  //end success
			error: function (error) {
				
			   //alert('Loading markers from Excel file "/Slave_data.xlsx "failed There happens an error. Make sure your Excel files are closed(therefor may prevent reading)');
               swal("Failed!", "Loading markers from Excel file '/Slave_data.xlsx' failed There happens an error. Make sure your Excel files are closed(therefor may prevent reading)", "warning");

            }	
        });
		
		
//NOT USED?????????
//getting Dataset markers values from Dataset(initial several markers are created in Studio manually)
// **************************************************************************************
// **************************************************************************************
// **                                                                                  **
// **                                                                                  **

gets_Dataset_features_from_API = function(){ //we use here Function Expression to pass the name of the function(declared here outside IIFE) to a different js script (js/add_marker.js)

    convert_Dataset_to_map(data); //function that displays marker from data
	//alert("Map is Refreshed");
	$('#techInfo').html('<h3>Точка А (отправка)</h3>') ;

}
// **                                                                                  **
// **                                                                                  **
// **************************************************************************************
// **************************************************************************************




//calls the function; we use here Function Expression to pass the name of the function(declared here outside IIFE) to a different js script (js/add_marker.js)
//gets_Dataset_features_from_API();





//object to hold geo data from Excel file {Geocoding_Process_Module/Slave_data.xlsx}
//var dataConvert = {type: "FeatureCollection",features:[]}; -> moves to global scope above,  must be outside IIFE  to be seen in js/direction-api.js

//adds one starting hard-coded point var dataConvert{}
dataConvert.features.push( {type: 'Feature', geometry: {type: 'Point', coordinates: window.START_POINT_from_SETTING /*[12.592224, 55.679681]*/ },  properties: {title: 'Точка А', description: 'Copenhagen'}});







//converts ajax success result array from {ajax/getCoordsListFromSlaveExcel.php} to geojson-OK format object (to build markers)
function createObject_dataConvert(dataFromSuccessAjax){ //dataFromSuccessAjax is data from ajax success callback

    
    //check if ../Geocoding_Process_Module/Slave_data.xlsx fie is not empty
    if (typeof dataFromSuccessAjax != 'object'){ //checks if dataFromSuccessAjax is Object, if not, e.g String, stop further. E.g if Excel file is empty/missing php script returns just error string.Otherwise if OK there should be other type, like Object
		//alert('Your Excel file "/Slave_data.xlsx" is empty, contains no addresses/coordinates');
		swal("Warning!", "Your Slave Excel file '/Slave_data.xlsx' seems to be empty and contains no addresses/coordinates. Please, make sure that Master Excel contains data and run Geocoding process at your Geocoding Panel", "warning");

		return false;}
	
	//Object.assign(dataConvert.features, dataFromSuccessAjax /*['a','b','c']*/);
	for( i = 0; i < dataFromSuccessAjax.length; i++){
		var coorddd = dataFromSuccessAjax[i].geometry.coordinates;
		//var t = JSON.stringify(coorddd);
		//var coordsF = t.split(",");
		//alert (coorddd[0]);
		dataConvert.features.push( {type: 'Feature', geometry: {type: 'Point', coordinates:coorddd },  properties: {title: dataFromSuccessAjax[i].properties.title, description: dataFromSuccessAjax[i].properties.description}});
		//dataConvert.features[] = {type: 'Feature', geometry: {type: 'Point', coordinates:coorddd},  properties: {title: 'Точка А (Отправка)', description: 'Copenhagen'}};
	}
	console.log(dataConvert);
	console.log(dataFromSuccessAjax);
}


         


//function to convert data received from ajax to markers on map
function convert_Dataset_to_map(geojson){ //{geojson} here is {var dataConvert{}}
	
	
     //removes all markers which are in array currentMarkers[] //useful when we added a new one and page makes a new reuest to Dataset Api
     if (currentMarkers!==null) {
         for (var i = currentMarkers.length - 1; i >= 0; i--) {
             currentMarkers[i].remove();
         }  
     currentMarkers=[]; 		 
	 }
	//END removes all markers which are in array currentMarkers[]
	
	
	
	
     //add markers to map from predefined array{var geojson}
     geojson.features.forEach(function(marker, idx) {
		 
		 //if elem is last, skip it as it creats an empty marker(last array el is {_proto__})
		 //if (idx === geojson.features.length - 1){ return false;}

		 //alert(idx);
         // create a HTML element for each feature
         var el = document.createElement('div');
         el.className = 'marker';

        // make a marker for each feature and add to the map
	 markerZXX = new mapboxgl.Marker(el)   //MEGA FIX -> var name {markerZXX} must differ from Tempo marker name, otherwise it 'll cause last Dataset marker dissapear onClick
       .setLngLat(marker.geometry.coordinates)
	   .setPopup(popuppZ = new mapboxgl.Popup({ offset: 25 }) // add popups
       .setHTML('<h3>' + marker.properties.title + '</h3>' + 
	         '<p>' + marker.properties.description + '</p>' +
			 //'<p style="font-size:0.5em">ID: ' + marker.id + '<br>' + //ID
			 'Lat/lan: ' + marker.geometry.coordinates + '</p>' )) // + //coords
			 //'<a href="#"><button class="btn btn-success" id="addRoute" data-toRoute=' + marker.geometry.coordinates + '>To route</button></a>&nbsp;' +  //id="addRoute" //button contains data-toRoute="markerCoords", will be used in js/direction.js, to get coords & differentiate marker from Dataset and temporary marker created onClick(tempo marker won't have attribute data-toRoute)
			 //'<a href="#"><button class="btn btn-danger" id="deletePlace" data-coords=' + marker.id + '>Delete</button></a>')) //assign a delete button data-coords with it's ID(to use in deletion)
       .addTo(map);
	
	   currentMarkers.push(markerZXX); //adds a currentle created marker to array in order to be able to remove them all from map
	   
	   
	   //$('#techInfo').html('<h3>' + marker.properties.title + '</h3>' + '<p>' + marker.properties.description + '</p>') ;
    });
	
	//html the 1st marker from geojson (it is a starting point - CPH)
	$('#techInfo').html('<h3>' + geojson.features[0].properties.title + '</h3>' + '<p>' + geojson.features[0].properties.description + '</p>') ;

		   
    //Function creates list of markers in Modal id="myModalInfo" -> <p id="list_of_markers">
	createList_of_markers_modal(geojson); 
	
	//Function creates list of markers in <select> <option>
	generateSelect('Select', 1, 'markerDropdown', geojson ); //args ("text for dropdown", 1 or to to add to id="selectID", span to html(), ApiDAta )
}
// END add markers to map from predefined array{var geojson}











//Creating temporary marker on map Click
//On map click(om any empty place)-> Get coordinates + Place a temprary marker to map + opens marker's pop-up automatically without clicking on marker-------------------------------------
//var markerZ; //global var  to be able remove prev temporary markers

map.on('click', function (e) {  //mousemove 

	 return false;
    //display/adds clicked coords to <div class="info">
    document.getElementById('info').innerHTML =
        // e.point is the x, y coordinates of the mousemove event relative
        // to the top-left corner of the map
        JSON.stringify(e.point) + '<br />' +
        // e.lngLat is the longitude, latitude geographical position of the event
        JSON.stringify(e.lngLat);
	
	clickedCoords = e.lngLat; //coords of clicked place
	
	//detects/checks if u not click on marker, if on marker - Stops everything
    var clickedEl = window.event ? event.srcElement : e.target;
    if (clickedEl.className && (" " + clickedEl.className + " ").indexOf(" marker ") != -1)   //marker is a class="marker"
	{
		//alert("u clicked marker, not the map"); !!!!!!!!!!!!!!!!!!!!!
		
		 //removes prev tempo marker if it was prev set by click
        if(typeof markerZ !== 'undefined'){
		    markerZ.remove();
	    }
		return false;
	}
	
	
	 //adding a  new generated marker to a clicked position(if u clicked on the map, not marker)
	 var el = document.createElement('div');
     el.className = 'marker markerAdded';  /* marker-clicked */ //class of created marker
	 var allMarkers = []; //not used???
	 
    //removes prev marker if it was set by click
    if(typeof markerZ !== 'undefined'){
		markerZ.remove();
	}
	
	
	//var for marker pop-uo
	//var popuppZ; //went outside IIFE
	
	//clickedCoords = e.lngLat; //coords of clicked place

	
	 //Set data to new generated temporary marker, when u click on any empty place on the map
	 /*var*/ markerZ = new mapboxgl.Marker(el)
         .setLngLat(e.lngLat)  //set coords
         .setPopup(popuppZ = new mapboxgl.Popup({ offset: 25 }) // add {var popuppZ} to be able to open it automatically
         .setHTML('<h3> Clicked Target </h3>' +
		          '<p>Save this point? <br><a href="#"><button class="btn btn-danger" id="savePlace">Want to order here?</button></a> '  +
				  //'<a href="#"><button class="btn btn-success add-route-btn" id="addRoute"> Add to route</button></a>' +
				  //'<a href="#"><button> Set as end</a></button> </p>' +
				  '<p>' + e.lngLat + '</p>'))
         .addTo(map);
		 
		 //currentMarkers.push(markerZ); //WE DON"T NEED IT FOR TEMPO MARKERS!!!! //adds a currentle created marker to array in order to be able to remove them all from map
		 
		 popuppZ.addTo(map); //opens pop-up automatically, without clicking on the marker
		 
		 //show pop-up
		 // Populate the popup and set its coordinates
         // based on the feature found.
         /*new mapboxgl.Popup().
		 .setLngLat(e.lngLat)
         .setHTML("description")
         .addTo(map);
          */
    //allMarkers.push(markerZ); alert(allMarkers);
	
	//allMarkers[0].remove();
	
});
//---------------------------------------------------------------------------------------------------------------------------------








//gets distance details between two points
//getMatrix();  //!!!!!!!!!!!!!!!!!!!!!!!!!!!



//NOT USED HERE??????????
//gets distance details between two points(does not draw route!!!!!!)
function getMatrix(){
	// send  data  to  PHP handler  ************ 
        $.ajax({
            url: 'https://api.mapbox.com/directions-matrix/v1/mapbox/driving/28.684956,50.265008;28.662900,50.262885?approaches=curb;curb&access_token=' + mapboxgl.accessToken,  //mapboxgl.accessToken is from Credentials/api-access_token.js
            //url:'https://api.mapbox.com/optimized-trips/v1/mapbox/driving/28.684956,50.265008;28.662900,50.262885?access_token=' +  mapboxgl.accessToken, 
			
			type: 'GET', //if {POST} it gets CORS error
			dataType: 'JSON', // without this it returned string(that can be alerted), now it returns object
			//passing the city
            data: { 
			    //serverCity:window.cityX
			},
            success: function(data) {
                // do something;
				//alert(JSON.stringify(data));
				console.log(data);
				var all_info = '<p><b>Matrix</b></p>';
				for( var i = 0; i < data.destinations.length; i++){
					all_info+= data.destinations[i].name + ', distance:' + (data.sources[i].distance/1000).toFixed(3) + ' km, duration:' + data.durations[i][1] + ' seconds <br>';
				}
				$("#matrixWindow").stop().fadeOut("slow",function(){ $(this).html(all_info)}).fadeIn(2000);
            },  //end success
			error: function (error) {
				alert("ajax matrix error-> " + error); 
				//$("#weatherResult").stop().fadeOut("slow",function(){ $(this).html("<h4 style='color:red;padding:3em;'>ERROR!!! <br> NO CITY FOUND</h4>")}).fadeIn(2000);
            }	
        });
                                               
       //  END AJAXed  part 
}



















     










//======================================= DIRECTION (works with checkbox only), custom directions is in js/directions.js ====================================





//DIRECTIONS->(draw routes)-> works only if checkbox is ON (top left)
//START DRAW ROUTE LINE (works only for a hardcoded start position when u switched checkbox on()top left)
//https://docs.mapbox.com/help/tutorials/getting-started-directions-api/
//-----------------------------------------------------------------------------------------

var BANDERI = [28.665445, 50.264004];
var GLOBAL_ASHAN = [28.684956, 50.265008];

// create a function to make a directions request
function getRoute(end) {
	//if checkbo DirectionMODE is OFF, stop any further
	if(DIRECTION_MODE == false){
	    return false;
	}
	
  // make a directions request using cycling profile
  // an arbitrary start will always be the same
  // only the end or destination will change
  var start = BANDERI; //GLOBAL_ASHAN; //it sets the START coords point GLOBAL
  var url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken; // //mapboxgl.accessToken is from Credentials/api-access_token.js

  // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.onload = function() {
    var data = req.response.routes[0];
    var route = data.geometry.coordinates;
	alert(route);
	
	
	
	//SET instructions to div class='instructions'-----------
	// get the sidebar and add the instructions
    var instructions = document.getElementById('instructions');
	instructions.className += ' bordered';
    var steps = data.legs[0].steps;

    var tripInstructions = [];
    for (var i = 0; i < steps.length; i++) {
        tripInstructions.push('<br><li>' + steps[i].maneuver.instruction) + '</li>';
       //instructions.innerHTML = '<h3>Directions API</h3><span class="duration">Trip duration: ' + Math.floor(data.duration / 60) + ' min 🚴 </span>' + tripInstructions;
	}
	var t = '<h3>Directions API</h3><span class="duration">Trip duration: ' + Math.floor(data.duration / 60) + ' min 🚴 </span>' + tripInstructions;
	$("#instructions").stop().fadeOut("slow",function(){ $(this).html(t)}).fadeIn(2000);
	//END SET instructions to div class='instructions'-------
	
    var geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };
    // if the route already exists on the map, reset it using setData
    if (map.getSource('route')) {
      map.getSource('route').setData(geojson);
    } else { // otherwise, make a new request
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: geojson
            }
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
    // add turn instructions here at the end
  };
  req.send();
}




var startt = GLOBAL_ASHAN; //NOT USED???? -merge it with getRoute() var start

map.on('load', function() {
  // make an initial directions request that
  // starts and ends at the same location
  
  
  
  
  
  
  
  
  
  
  
  
  
  //------------AAAAAAAAAAAAAAAAAAAAAAAa
  
  function aaaab(){
      var canvas = map.getCanvasContainer();
      canvas.style.cursor = '';
      var coords = BANDERI;  //END POINT ????
      var end = {
      type: 'FeatureCollection',
          features: [{
          type: 'Feature',
          properties: {},
          geometry: {
              type: 'Point',
              coordinates: coords
          }
          }
          ]
      };
      if (map.getLayer('end')) {
          map.getSource('end').setData(end);
      } else {
          map.addLayer({
              id: 'end',
              type: 'circle',
              source: {
              type: 'geojson',
              data: {
                  type: 'FeatureCollection',
                  features: [{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                      type: 'Point',
                      coordinates: coords
                  }
                  }]
              }
              },
              paint: {
                  'circle-radius': 10,
                  'circle-color': '#f30'
              }
         });
     }
  }
  
  //END -------------AAAAAAAAAAAAAAAAAAAAAAAa
  
  
  
  if(DIRECTION_MODE == true){  //if u toggled checkbox top left
      getRoute(BANDERI); // arg is END POINT, START POINT IS SET INSIDE FUNCTION ITSELF
      aaaab();
  
  //WHY 2 TIMES calling?
   getRoute(BANDERI); // arg is END POINT, START POINT IS SET INSIDE FUNCTION ITSELF
  
  
  
  

  
  
  
  // Add starting red point to the map
  map.addLayer({
    id: 'point',
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [28.684956, 50.265008] //startt
          }
        }
        ]
      }
    },
    paint: {
      'circle-radius': 10,
      'circle-color': 'red' //'#3887be'
    }
  });
  
  
  
  
  // Add ENDING red point to the map
  /*
  map.addLayer({
    id: 'point2',
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [28.684956, 50.265008]
          }
        }
        ]
      }
    },
    paint: {
      'circle-radius': 10,
      'circle-color': 'red' //'#3887be'
    }
  });
  */
  
} // END if(DIRECTION_MODE){
	
  
  // this is where the code from the next step will go -> DRAW GOES HERE
 // initialize the map canvas to interact with later
 
  


  map.on('click', function(e) {   
    if(DIRECTION_MODE == true){  //if u toggled checkbox top left  
      var canvas = map.getCanvasContainer();
      var coordsObj = e.lngLat;
      canvas.style.cursor = '';
      var coordsClicked = Object.keys(coordsObj).map(function(key) {
         return coordsObj[key];
      });
      var endCoords = {
      type: 'FeatureCollection',
          features: [{
          type: 'Feature',
          properties: {},
          geometry: {
              type: 'Point',
              coordinates: coordsClicked
          }
          }
          ]
      };
      if (map.getLayer('end')) {
          map.getSource('end').setData(endCoords);
      } else {
          map.addLayer({
              id: 'end',
              type: 'circle',
              source: {
              type: 'geojson',
              data: {
                  type: 'FeatureCollection',
                  features: [{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                      type: 'Point',
                      coordinates: coordsClicked
                  }
                  }]
              }
              },
              paint: {
                  'circle-radius': 10,
                  'circle-color': '#f30'
              }
         });
     }
	 
     getRoute(coordsClicked);
} // END if(DIRECTION_MODE){
});


  // END this is where the code from the next step will go
});

// END DRAW LINES

























    //DIRECTION MODE  -> ON/OFF. Changing Checkbox for reloop, checks if DIRECTION Mode is on
	// **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 
	$("#myCheck").click(function() { 
	    if ($("#myCheck").is(':checked') ){  //if u selected looping in Checkbox
	        DIRECTION_MODE = true; 
            getRoute(BANDERI); 
			aaaab();
            getRoute(BANDERI);			
	    } else {
		   DIRECTION_MODE  = false;    
	    }
	});
	 
	// **                                                                                  **
    // **************************************************************************************
    // **************************************************************************************
	
	
	
	




	
	
	
	
	
	
    //Show/hide markers on top right click
	// **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 
	$(".upload").click(function() { 
	
	
	    if ($("#markerShowHide").text()=="Hide marks"){
		    $("#markerShowHide").stop().fadeOut("fast",function(){ $(this).text('Show marks')}).fadeIn(500); //change text in <a>
			
			//Code for Buttons(change text)
			/*if ($("#btn_Control").prop("value")=="Hide markers"){
			  $("#btn_Control").stop().fadeOut("fast",function(){ $(this).attr('value', 'Show markers')}).fadeIn(500);
			  //$("#btn_Control").attr('value', 'Show markers');
			*/
			
			//removes all markers which are in array currentMarkers[]
            if (currentMarkers!==null) {
                for (var i = currentMarkers.length - 1; i >= 0; i--) {
                currentMarkers[i].remove();
                }  	
		     }
	
	    
        } else { //if markers are hidden -show them
			
			$("#markerShowHide").stop().fadeOut("fast",function(){ $(this).text('Hide marks')}).fadeIn(500);
			
			//show all markers which are in array currentMarkers[]
            if (currentMarkers!==null) {
                for (var i = currentMarkers.length - 1; i >= 0; i--) {
                currentMarkers[i].addTo(map);
                }  	
		     }
		}
		
	});
	 
	// **                                                                                  **
    // **************************************************************************************
    // **************************************************************************************
	
	
	
	
	
	//Closes #ETA div (i.e "Marker has beeen saved/deleted"). <span>X</span> is added in JS(i.e in js/add_marker.js)
	// **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 

	$(document).on("click", '.close-eta', function() {   // this click is used to react to newly generated cicles;
	    $("#ETA").stop().fadeOut(2000,function(){ $(this).text('')}).fadeIn(500); //animate
	});
	 
	// **                                                                                  **
    // **************************************************************************************
    // **************************************************************************************
	
	
	
	
	
	
	//global Function to remove any markers and pop-ups, it is global & declared var out of IIFE to use in other scripts
	// **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 
	removeMarker_and_Popup = function(){
		 //removes prev marker pop-up if it was set by click. If uncomment it will not open pop-up "Start/end point" for temporary markers
        if(typeof popuppZ !== 'undefined'){  //popuppZ is global from mapbox_store_location.js, defined at 1st line, outside IIFE here and in mapbox_store_location.js
		    popuppZ.remove();
	    }
		
		//removes prev marker if it was set by click
         if(typeof markerZ !== 'undefined'){
		     markerZ.remove();
	     }
	}
	// **                                                                                  **
    // **************************************************************************************
    // **************************************************************************************
	
	
	
	
	
	//Function creates list of markers in Modal id="myModalInfo" -> <p id="list_of_markers">
    // **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 
	function createList_of_markers_modal(dataFromApi){ 
	    var allList = "<br><h4>Your list of markers:  " + Object.keys(dataFromApi.features).length + " items.</h4>";
		
	    dataFromApi.features.forEach(function(dataZ, i) {
			allList += "<p>" + (i +1) + " " + dataZ.properties.title + "</p>"; //number + title
		});
		$("#list_of_markers").html(allList);
		
		
		 
	}
	
	// **                                                                                  **
    // **************************************************************************************
    // **************************************************************************************
	
	
	
	
	
	
	   //Function that generates markers list in <option><select> in header
	   // **************************************************************************************
       // **************************************************************************************
       //                                                                                     **
	   
	   function generateSelect(selectText, i, spanID, geojsonX){ ////args ("text for dropdown", 1 or to to add to id="selectID", span to html(), ApiDAta object )
	       var destination = "<select id='selectID" + i + "'>";
	       destination += "<option value='' selected='selected'>" + selectText + "</option>";
		   myList = ""; //list for instruction modal
		   //alert(geojsonX.features.length);
	       for ( i = 0; i < geojsonX.features.length; i++ ){
		       //alert(geojsonX.features[i].geometry.coordinates);
		       destination = destination + "<option value='" + geojsonX.features[i].geometry.coordinates + "'>" + geojsonX.features[i].properties.title + "</option>"; 
			   
			   //markers list for Instruction modal window
			   myList = myList + "<p>" + (i + 1) + "." + geojsonX.features[i].properties.title + "</p>";
	        } 
	   
	        destination = destination + "</select>";
	        $("#" + spanID).html(destination);
	        //$("#destination2").html(destination);
	        //end generates option_select
			
			
	   }
	  // **                                                                                  **
      // **************************************************************************************
      // **************************************************************************************
	
	
	
	  
	   //IT Listens/detects changes in markers <select><option/> and makes map camera flies there
	   // **************************************************************************************
       // **************************************************************************************
       //                                                                                     **
	  $(document).on("change", '#selectID1', function() {   // this click is used to react to newly generated cicles;
	      //alert($("#selectID1 option:selected").text()); //alert($("#selectID1").val());
		  $(this).blur();//hide Select list(as in mobile it remains still)
		  map.flyTo({
					center: $("#selectID1").val().split(","), //creates array [23.45454, 51.56565]
					zoom: 8,
                    bearing: 0, speed: 0.8, // make the flying slow
                    curve: 1, // change the speed at which it zooms out
					});
			
		  $('#techInfo').html('<h3>' + $("#selectID1 option:selected").text() + '</h3>') ;  //$("#selectID1 option:selected").text() 

	  });
	  
	
	
	
		
	//global Function to scroll to certain div, it is global & declared out of IIFE to use in other scripts
	// **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 
	scrollResults = function (divName, parent)  //arg(DivID, levels to go up from DivID)
	{   //if 2nd arg is not provided while calling the function with one arg
		if (typeof(parent)==='undefined') {
		
            $('html, body').animate({
                scrollTop: $(divName).offset().top
                //scrollTop: $('.your-class').offset().top
             }, 'slow'); 
		     // END Scroll the page to results
		} else {
			//if 2nd argument is provided
			var stringX = "$(divName)" + parent + "offset().top";  //i.e constructs -> $("#divID").parent().parent().offset().top
			$('html, body').animate({
                scrollTop: eval(stringX)         //eval is must-have, crashes without it
                }, 'slow'); 
		}
	}
	
	// **                                                                                  **
    // **************************************************************************************
    // **************************************************************************************
	
	
	
	
	
	//Function to scroll the page to top
	// **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 
	
	scroll_toTop = function () 
	{
	    $("html, body").animate({ scrollTop: 0 }, "slow");	
	}
	// **                                                                                  **
    // **************************************************************************************
    // **************************************************************************************
	
	
	
	
	
	
	
	
	
	
	
	
	
	  
	  //--------------****************************** NEW ****************************************************


	
	
	
	


	
	
	


});
// end ready	
	
	
	
}()); //END IIFE (Immediately Invoked Function Expression)










       //universal functions that shows info of running events(on black screen on top or tech info below), used instead of alerts, uses var counterb, arg(div, message, css class to add), out of IIFE(as variant can use function expression, and declare just {var displayStatus} outside the IIFE)
	  // **************************************************************************************
      // **************************************************************************************
      //                                                                                     ** 
	  function displayStatus(myDiv, message, cssClass) //arg(div, message, css class to add)
	  {
		  var counterb;
		  counterb++; //counter to encrease delays
		  var data =  $(myDiv).html(); //gets prev messages //TEMP NOT USED
		  var final = data + "<p class='" + cssClass + "'>" + message + "</p>";    //adds a new to prev  //TEMP NOT USED
		  //$(myDiv).hide().html(final).fadeIn(2000);  //disable for makes lines appear one by one with .append
		  
		  //$(myDiv).stop().fadeOut("slow",function(){ $(this).html(final)}).fadeIn(2000);
		  
		  $(myDiv).hide().fadeIn(2000); //makes div visible
		  
		  setTimeout(function(){     //each line appears with delay
		      $(myDiv).append("<p class='" + cssClass + "'>" + message + "</p>")   		  
		  }, counterb * 2000); //counterb * 1000 encreases the time for next line to appear
		  
		  
	  }
	  //END functions thats shows info of running, instead of alerts


	  
	  
	  
	  
	  
	  
	  
	  
	