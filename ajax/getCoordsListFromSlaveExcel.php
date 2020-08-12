<?php
//reached with ajax, gets addresses and coord columns from ../Slave_data via SimpleXLSX.php, form geojson-OK array. Used in root/js/mapbox_store_location.js 

//uses https://github.com/shuchkin/simplexlsx to read Excel files
include "../Library/SimpleXLSX.php";


//include Classes
include "../Geocoding_Process_Module/Classes/Calc_Distance_And_Sort_By_Coords.php"; //for Google Maps URL
use Classes\SortingDistance\Calc_Distance_And_Sort_By_Coords; //for Google Maps URL



//will contain array with coords and names
$features = array();

$temoArrayWithCoordsAdresses = array(); //for Google Maps URL//temp array to hold (adress, coords, distance in km(from START POINT)), will be used for usort() by distance and create Google Map link


//if successfully got the data from ../Slave_data via SimpleXLSX.php Library
if ( $xlsx = SimpleXLSX::parse('../Geocoding_Process_Module/Slave_data.xlsx') ) {
	
	 $newData = array();//for Google Maps URL
	 $i = 0;            //for Google Maps URL
	 
	foreach( $xlsx->rows() as $r ) {
		$t = explode(", ",$r[1]);  //$r[1] is a coords column from excel
		array_push($features, array(
		                        'geometry'=> array(
					              'type'=>'Point', 
								   'coordinates'=> array($t[0], $t[1] )   //Mega fix here, $r[0] is an address column from excel
								   
					),
					'properties'=> array('title'=>$r[0], 'description'=> $r[0])
					));
					
		//for Google Maps URL**************
		//getting address together from several columns 
		      $coordsColumn = $r[1] ; //gets "9.267621, 55.430676"
			  $addressColumn = str_replace("ø","o", $r[0]); //replace danish{ø} with normal o
			  $addressColumn = rawurlencode($addressColumn); //MegaFix ->  replace blankspace in 
			
			  $colCoord = explode(",", $coordsColumn); //explode string "9.267621, 55.430676" to array
			
			  //calc the distance in km between args. From included Class
			  $distance = Calc_Distance_And_Sort_By_Coords::calcDistance($Start_Point_Copenhagen[0], $Start_Point_Copenhagen[1], $colCoord[0], $colCoord[1], "K") ;

              array_push($temoArrayWithCoordsAdresses, array($addressColumn, $coordsColumn, 'distance' => $distance)); //array(Volgade 8, "9.267621, 55.430676", 120km);
			
		      $i++;
		//END for Google Maps URL*******************
	}
	
	
	
	//for Google Maps URL**************
	
	//my custom function to sort array by distance, from short to longer distances. Used in usort() 
	 function myCompare_Distances($a, $b) {
          if($a['distance'] > $b['distance']) return 1;
          elseif($a['distance'] < $b['distance']) return -1;
          else return 0;
      }
  
	uasort($temoArrayWithCoordsAdresses,'myCompare_Distances'); 
    //form the URL for Google maps directions
    $urlText = "https://www.google.com.ua/maps/dir/";
    for ($i = 0; $i < count($temoArrayWithCoordsAdresses); $i++){
	         //explode and reverse lat,long for Google maps
	         $z = explode(",", $temoArrayWithCoordsAdresses[$i][1]);
	         $urlText.= $z[1] . "," . $z[0] . "/";
     }	
    //for Google Maps URL**************
	
	
	
	
	$response = array(); 
    $response ['features'] = $features; //sets of coords, addresses
	$response ['urlText'] = $urlText; 
	
    echo json_encode($response);	
} else {
	echo json_encode(SimpleXLSX::parseError());
}



//variant of reading excel with fopen(), 
/*
$f = fopen('../Geocoding_Process_Module/Slave_data.xls', "r+");

//Output lines until EOF is reached
while(! feof($f)) {
  $line = fgets($f);
  $bodytag = str_replace("' '", "!!", $line);
  //echo $line. "<br>";
  $part = explode('" "', $line);
  echo $line. "<br>";
  
  array_push($features, array(
		            'geometry'=> array(
					            'type'=>'Point', 
								'coordinates'=> array( explode(", ",$part[1])   )
					),
					'properties'=> array('title'=>'Copen', 'description' => $part[0] )
					));
		
	}

fclose($f);
echo json_encode($features);
*/


?>