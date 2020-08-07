<?php
//reached with ajax, gets addresses and coord columns from ../Slave_data via SimpleXLSX.php, form geojson-OK array. Used in root/js/mapbox_store_location.js 

//uses https://github.com/shuchkin/simplexlsx to read Excel files
include "../Library/SimpleXLSX.php";

//will contain array with coords and names
$features = array();

//if successfully got the data from ../Slave_data via SimpleXLSX.php Library
if ( $xlsx = SimpleXLSX::parse('../Geocoding_Process_Module/Slave_data.xlsx') ) {
	
	foreach( $xlsx->rows() as $r ) {
		$t = explode(", ",$r[1]);  //$r[1] is a coords column from excel
		array_push($features, array(
		                        'geometry'=> array(
					              'type'=>'Point', 
								   'coordinates'=> array($t[0], $t[1] )   //Mega fix here, $r[0] is an address column from excel
								   
					),
					'properties'=> array('title'=>$r[0], 'description'=> $r[0])
					));
		
	}

    echo json_encode($features);	
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