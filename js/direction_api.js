//Directions Api-> draw route between two  manually selected points
//Works In normal mode (when checkbox is off), creates a route line between 2 points, u have to click on empty map or marker and select "Add to route". When 2 points are selected the route will be drawn + ETA will be displayed.


//https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-directions/ !!!!!!!

var map; //coords of clicked place ???
var popuppZ;//global from mapbox_store_location.js

(function(){ //START IIFE (Immediately Invoked Function Expression)

  $(document).ready(function(){
	
	

 
	 
	 
	 
	 //NOT USED HERE???????
	//Just bundle function to run getRoute(). It must be run 2 times in order to draw a line between 2 points
	// **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 
	/*
	 function run_direction_API(){
		 //getRoute([28.665445, 50.264004], [28.684956, 50.265008]);
		 getRoute(start_end_array[0], start_end_array[1]); //start_end_array stores 2 els-> from & to, i.e [[20.454,50.4546], [20.454,50.4546]]
		 getRoute(start_end_array[0], start_end_array[1]);
	 }
	 */
	// **                                                                                  **
    // **************************************************************************************
    // **************************************************************************************
	 
	 
	 
	 
	 
	 
	
	 
	 
	 
	//  --- NEW MapBox Denmark ---------------

	 
//======================================= DIRECTION API ========================================================================
// core function that smake a directions Api request and draw route, docs => https://docs.mapbox.com/help/tutorials/getting-started-directions-api/
function getRoute(startX, end) { //start, end coords. According to start and end coords, API returns array of coords to draw route, i.e array[ [lat,lon], [lat,lon], [lat,lon] ]
	
	
  // make a directions request using cycling profile
  // an arbitrary start will always be the same
  // only the end or destination will change
  var start = startX;  //it sets the START coords point GLOBAL
  //alert("start[0]-> " + end[1]);
  var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken; // //mapboxgl.accessToken is from Credentials/api-access_token.js

  // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.onload = function() {
    var data = req.response.routes[0];
    var route = data.geometry.coordinates;
	//alert(route); //COORDINATES!!!
	
	//console.log(data);
	
	//SET instructions to div class='instructions'-----------
	// get the sidebar and add the instructions
	/*
    var instructions = document.getElementById('instructions');
	instructions.className += ' bordered';
    var steps = data.legs[0].steps;

    var tripInstructions = [];
    for (var i = 0; i < steps.length; i++) {
        tripInstructions.push('<br><li>' + steps[i].maneuver.instruction) + '</li>';
       //instructions.innerHTML = '<h3>Directions API</h3><span class="duration">Trip duration: ' + Math.floor(data.duration / 60) + ' min рџљґ </span>' + tripInstructions;
	}
	
	//HTML Instruction div in the bottom
	var t = '<h3>Directions API</h3><span class="duration">Trip duration: ' + Math.floor(data.duration / 60) + ' min. Distance: ' + Math.floor(data.distance / 1000) + ' km </span>' + tripInstructions;
	$("#instructions").stop().fadeOut("slow",function(){ $(this).html(t)}).fadeIn(2000);
	
	//html() ETA
	$("#ETA").stop().fadeOut("slow",function(){ $(this).html( '<p><i class="fa fa-share-square-o" style="font-size:30px"></i> Route time: <b>' + Math.floor(data.duration / 60) + ' min. Distance: ' + Math.floor(data.distance / 1000) + ' km </b><span class="close-eta">X</span></p>')}).fadeIn(2000); //show ETA above the map
	//END SET instructions to div class='instructions'-------
	*/
	
	 //removes prev marker pop-up if it was set by click + removes prev marker if it was set by click //function from js/mapbox_store_location.js
	 removeMarker_and_Popup();
	 
    // add turn instructions here at the end
	
	
	
	
	
	
	
	//Draw LineString, 2020**************************
	map.addSource('route', {
'type': 'geojson',
'data': {
'type': 'Feature',
'properties': {},
'geometry': {
'type': 'LineString',
'coordinates': myAjaxCoords
}
}
});
map.addLayer({
'id': 'route',
'type': 'line',
'source': 'route',
'layout': {
'line-join': 'round',
'line-cap': 'round'
},
'paint': {
'line-color': '#888',
'line-width': 8
}
});
	//
//Draw LineString, 2020**************************
	
  };
  
  
  req.send();
  
  
  
  
  
		
		
}
	 
	 
//======================================= DIRECTION API 2020 ========================================================================	


 
	 
//dataConvert is global scope var from js/mapbox_store_location.js. To be in global scope must be out of IIFE there

	
	
	
//draw route LineString bassed on multiple coords array in arg, 
// core function that make a directions Api request and draw route, docs => https://docs.mapbox.com/help/tutorials/getting-started-directions-api/
// **************************************************************************************
// **************************************************************************************
// **                                                                                  **
// **                                                                                  **


function getRouteMultiplesCoods(arrayX){  //arrayX is array in format[ [lat,lon], [lat,lon], [lat,lon] ]
 
  var coordsHolder = ''; //holds a string of all coord separated by ";", ie 'lat1,lon1;lat2,lon2', e.g. '-84.5186,39.134;-84.51,39.102'
  for(i = 0; i < arrayX.length; i++){
	  coordsHolder = coordsHolder + arrayX[i][0] + "," + arrayX[i][1] + ";";
  }
  
  //cut the last symbol ";" in string that causes Api crash
  coordsHolder = coordsHolder.substring(0, coordsHolder.length - 1);

  console.log(coordsHolder);
  
  var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coordsHolder + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken; // //mapboxgl.accessToken is from Credentials/api-access_token.js

  console.log(url); 
  
  // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.onload = function() {
	  console.log(req.response);
    var data = req.response.routes[0];
    var route = data.geometry.coordinates;
	alert(route); //COORDINATES!!!
	

	
	 //removes prev marker pop-up if it was set by click + removes prev marker if it was set by click //function from js/mapbox_store_location.js
	 removeMarker_and_Popup();
	 

	
	//Draw LineString, 2020**************************
	map.addSource('route', {
'type': 'geojson',
'data': {
'type': 'Feature',
'properties': {},
'geometry': {
'type': 'LineString',
'coordinates':route
}
}
});
map.addLayer({
'id': 'route',
'type': 'line',
'source': 'route',
'layout': {
'line-join': 'round',
'line-cap': 'round'
},
'paint': {
'line-color': '#888',
'line-width': 8
}
});
	//
//Draw LineString, 2020**************************
	
  };
  
  
  req.send();
  

}	
	 
	 
	 
	 
	 
	 
	 
     //when u click Button "Show route"
	 // **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 
	$("#LineStringShowHide").click(function() {  
	    //alert( $("#LineStringShowHide").attr('value') );
		
	    if ( $("#LineStringShowHide").attr('value') == 'Show Route Line'){
			 $("#LineStringShowHide").attr('value', 'Hide Route Line');
			 map.flyTo({/*center: e.features[0].geometry.coordinates,*/ zoom:7});
			 
			 var startZ = [12.592224, 55.679681];  // NOT USED????
             var endZ = [11.720648, 55.466004];	 
             //getRoute(startZ, endZ);
			 
			 //dataConvert is global scope var from js/mapbox_store_location.js. Stores all markers from excel file {Geocoding_Process_Module/Slave_data.xlsx}. To be in global scope must be out of IIFE there
             var arrayXX = []; //arrayXX is array in format[ [lat,lon], [lat,lon], [lat,lon] ]. Converted from var dataConvert. dataConvert is global scope var from js/mapbox_store_location.js. Stores all markers from excel file {Geocoding_Process_Module/Slave_data.xlsx}. To be in global scope must be out of IIFE there

			 //itearte over  var dataConvert
			  dataConvert.features.forEach(function(marker, idx) {
				  arrayXX.push(marker.geometry.coordinates);
			  });
			 console.log(arrayXX);
			 
			 getRouteMultiplesCoods(arrayXX); //2020 variant-> //draw route LineString bassed on multiple coords array in arg
		    //getRouteMultiplesCoods([ [12.592224, 55.679681], [12.304537, 55.931858] ]); //2020 variant-> //draw route LineString bassed on multiple coords array in arg


             //getRoute(startZ, endZ);			 
	 

        } else {
			$("#LineStringShowHide").attr('value', 'Show Route Line');
			map.flyTo({/*center: e.features[0].geometry.coordinates,*/ zoom:9});
			//remove Direction Api //clears Direction API line layer(line route)
		 if (map.getLayer('end')) {
			  map.removeLayer('route'); //to clear Direction Api Layer, u have to remove both Layer and Source. Layer must be removed FIRST!!!!!!!!!!!!!
			  map.removeSource('route');
              map.removeLayer('end'); 
			  map.removeSource('end');
		 }

		}			
	    
	});
	 
	// **                                                                                  **
    // **************************************************************************************
    // **************************************************************************************	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 

  });
  // end ready	
	
	
	
}()); //END IIFE (Immediately Invoked Function Expression)
