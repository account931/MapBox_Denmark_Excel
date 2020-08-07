//Directions Api-> draw route between two  manually selected points
//Works In normal mode (when checkbox is off), creates a route line between 2 points, u have to click on empty map or marker and select "Add to route". When 2 points are selected the route will be drawn + ETA will be displayed.


//https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-directions/ !!!!!!!

var map; //coords of clicked place ???
var popuppZ;//global from mapbox_store_location.js

(function(){ //START IIFE (Immediately Invoked Function Expression)

  $(document).ready(function(){
	
	
	
	//nOT USED HERE????????
    //When u click at any empty space at map & then click "add to route" in any temporary pop-up or click "Add to route" in marker from Dataset API
    // **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 
	
	//array will store only 2 elements-> from and to coors , i.e [[20.454,50.4546], [20.454,50.4546]]
	var start_end_array = [];
	var resR;
	
	//button id="addRoute" Add to Route could be either in marker from Dataset or in temporary marker generated onClick on empty map. Dataset button "Add to route" will have {data-toRoute="coords"}, tempo marker will have no.
    $(document).on("click", '#addRoute', function() {   // this  click  is  used  to   react  to  newly generated cicles;
	
	    if($(this).attr("data-toRoute")){ //if clicked button has {data-toRoute="coords"},i.e it is button with marker from Dataset API. Coords come as "23.44, 45.54"
			//alert("DATASET " + $(this).attr("data-toRoute") );
		    resR = $(this).attr("data-toRoute"); //assign to var {resR} value from {data-toRoute}.It will be = "23.44, 45.54"
			
			
		} else { //if clicked button does not have {data-toRoute="coords"},i.e it is temporary marker generated on click on empty map. Coords come as " LngLat(28.6602951587, 50.266253504)" 
		
			//alert("Tempo");
			clickedCoords = clickedCoords; //just remain unchanged // It will be = " LngLat(28.6602951587, 50.266253504)"  //coords of clicked empty place, come from /js/mapbox_store_location.js
			console.log(clickedCoords); //clickedCoords; //coords of clicked place, come from /js/mapbox_store_location.js
	        var res = clickedCoords.toString().match(/\(.*?\)/g); //{toString()} is a must // finds anything in ();
		    var resR = res.toString().replace(/\(/g, "").replace(/\)/g, ""); //removes (), and we get string, we should turn to float. Now it is -> "20.58335", "50.54756"
		}
	
	    
	
	
	    
		resR = resR.split(','); //split string to array->  ["20.58335", "50.54756"]
	
		var res2 = [];
		for(var i = 0; i < resR.length; i++){
			res2.push(parseFloat(resR[i]))  //MEGA FIX -> should convert every array el to type parseFloat
		}
		//alert(res2);
		
		var clearArrayText = "<span id='clearArray' class='start-end-info'>X</span>"; //var keeps icon "X" to close info window "From:" and "To:". We'll attach it later
		
		//if 1st array el is empty, i.e it is the 1st click on "add to route", i.e it is "From:"
		if(typeof start_end_array[0] === 'undefined'){
			start_end_array[0] = res2;
			var tx = "<span class='start-end-info'>from: " + start_end_array[0] + clearArrayText + "</span>";
			
			//html the marker div with text "Start point", but it change that marker content 4ever, which is no-go for Dataset Api marker, so we have BS warn("Clear") to clear all and re-call {gets_Dataset_features_from_API();} to rebuilt Dataset markers
		    $(this).parent().closest('div').html("Start point");
			//var startEndText = "Start"; //not used
			
		//if it is the second click	on "add to route", i.e it is "To:"
		} else {
			start_end_array[1] = res2;
			var tx = "<span class='start-end-info'>from: " + start_end_array[0] + clearArrayText + "</span><br> <span class='start-end-info'>to__: " + start_end_array[1] + "</span>";
			//alert("ff " + start_end_array.length);
			
			//html the marker div with text "End point", but it change that marker content 4ever, which is no-go for Dataset Api marker, so we have BS warn("Clear") to clear all and re-call {gets_Dataset_features_from_API();} to rebuilt Dataset markers
		    $(this).parent().closest('div').html("End point");
			//var startEndText = "END"; //not used
			
			run_direction_API();	//RUN CORE DIRECTION API FUNCTION
		}
		
		
		///html "from:" and "to:" in the header
	    $("#start_end_direction_info").stop().fadeOut("slow",function(){ $(this).html(tx)}).fadeIn(2000); 



		 //removes prev tempo marker if it was prev set by click
		 /*
        if(typeof markerZ !== 'undefined'){ //alert("exist");
		    markerZ.remove();
	    } 
		*/
		
		
		 //removes prev marker pop-up if it was set by click. //removes prev marker if it was set by click
		 //removeMarker_and_Popup();
		 
		 
	
		
	   //adding a  new generated marker to a clicked position(if u clicked on the map, not marker)
	  /*
	   var el = document.createElement('div');
       el.className = 'marker markerAdded';  /// //class of created marker
		//Set data to new generated temporary marker, when u click on any empty place on the map
	      markerZ = new mapboxgl.Marker(el)
         .setLngLat(resR)  //set coords
         .setPopup(popuppZ = new mapboxgl.Popup({ offset: 25 }) // add {var popuppZ} to be able to open it automatically
         .setHTML('<p>' + startEndText +  '</p>'))
         .addTo(map);
		 

		 popuppZ.addTo(map); //opens pop-up automatically, without clicking on the marker
		*/ 
	 
	 
	});//end click
	// **                                                                                  **
    // **************************************************************************************
    // **************************************************************************************	
		
		
	




     //NOT USED HERE?????????
    //Clears "From:" and "To:" fields in info window in the header + clears ETA + clears Direction layer
	// **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 
     $(document).on("click", '#start_end_direction_info', function() {   // this  click  is  used  to   react  to  newly generated cicles;	
	     $("#start_end_direction_info").stop().fadeOut("slow",function(){ $(this).html("")}).fadeIn(2000); //clears 
		 start_end_array = [];  //reset From/to array
		 
		 //clears ETS
		 $("#ETA").stop().fadeOut("slow",function(){ $(this).html('')}).fadeIn(2000);
		 
		 //clears Direction API line layer(line route)
		 if (map.getLayer('end')) {
			  map.removeLayer('route'); //to clear Direction Api Layer, u have to remove both Layer and Source. Layer must be removed FIRST!!!!!!!!!!!!!
			  map.removeSource('route');
              map.removeLayer('end'); 
			  map.removeSource('end');
		 }
		 
		 //removes prev marker pop-up if it was set by click. //removes prev marker if it was set by click
		 removeMarker_and_Popup();
		 
		 //calls the function as we changed  markers content to "Start/end" 4ever, which is no-go for Dataset Api marker, so we re-call {gets_Dataset_features_from_API();} to rebuilt Dataset markers
         gets_Dataset_features_from_API(); //refresh map markers , function from js/mapbox_store_location.js //as DATASET markers now contain "Start/Stop" text not original info
       
	   
	     //if my bootstrap warn exists (Green block with "Clear route"), remove it with animation
	     if($('.myWarn').length){
			$(".myWarn").hide('slow', function(){ $this.remove(); }); 
         }
     });//end click
	// **                                                                                  **
    // **************************************************************************************
    // **************************************************************************************
     //END Clears "From:" and "To:" info window in the header
	 
	 
	 
	 
	 
	 
	 
	 //NOT USED HERE???????
	//Just bundle function to run getRoute(). It must be run 2 times in order to draw a line between 2 points
	// **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 
	
	 function run_direction_API(){
		 //getRoute([28.665445, 50.264004], [28.684956, 50.265008]);
		 getRoute(start_end_array[0], start_end_array[1]); //start_end_array stores 2 els-> from & to, i.e [[20.454,50.4546], [20.454,50.4546]]
		 getRoute(start_end_array[0], start_end_array[1]);
	 }
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
	 
	
	/*
    var geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route //Found coordinates
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
    } */
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
  
  
  //aaaaaaaaaaa  Display on map end point icon ?????
  /*
  var canvas = map.getCanvasContainer();
      canvas.style.cursor = '';
	
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
                      coordinates: end
                  }
                  }]
              }
              },
              paint: {
                  'circle-radius': 10,
                  'circle-color': '#f30'
              }
         });
     } */
  // end aaaaaa
  
  
  
   //Append green Bootstrap warning ("Clear") with animation
   /*
   var new_BSwarning = $('<div id="start_end_direction_info" class="myWarn alert alert-success text-center col-centered iphoneX" style="position:absolute;top:10px;width:95%; margin-left:10px; border:2px solid white; cursor:pointer;"> Clear the route</div>').hide();
   $("#map").append(new_BSwarning); 
   new_BSwarning.show(5000);	
  */	
		
		
}
	 
	 
//======================================= DIRECTION API ========================================================================	


 
	 
//dataConvert is global scope var from js/mapbox_store_location.js. To be in global scope must be out of IIFE there

	
	
	
	
	
	
	
	
	
//draw route LineString bassed on multiple coords array in arg, 
// core function that make a directions Api request and draw route, docs => https://docs.mapbox.com/help/tutorials/getting-started-directions-api/
function getRouteMultiplesCoods(arrayX){  //arrayX is array in format[ [lat,lon], [lat,lon], [lat,lon] ]
 
  var coordsHolder = ''; //holds a string of all coord separated by ";", ie 'lat1,lon1;lat2,lon2', e.g. '-84.5186,39.134;-84.51,39.102'
  for(i = 0; i < arrayX.length; i++){
	  coordsHolder = coordsHolder + arrayX[i][0] + "," + arrayX[i][1] + ";";
  }

  console.log(coordsHolder);
  
  var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coordsHolder + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken; // //mapboxgl.accessToken is from Credentials/api-access_token.js

  console.log(url); 
  
  // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.onload = function() {
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
