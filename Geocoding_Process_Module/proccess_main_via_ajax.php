<?php
//Truncated variant of proccess_main_NOT_USED.php. See source code there.
//accessed via ajax for better UI/UX, though can work directly after some amendments
error_reporting(E_ALL);

//uses https://github.com/shuchkin/simplexlsx to read Excel files
include "../Library/SimpleXLSX.php";


//uses https://github.com/shuchkin/simplexlsxgen to write Excel files
include "../Library/SimpleXLSXGen.php";


//MapBox Api keys
include "../Credentials/php_api_credentials/api_credentials.php";

//include Classes
include "Classes/MakeGeocodeCurlRequest.php";
include "Classes/Calc_Distance_And_Sort_By_Coords.php";
use Classes\Geocoding\MakeGeocodeCurlRequest; //namespace for Class MakeGeocodeCurlRequest
use Classes\SortingDistance\Calc_Distance_And_Sort_By_Coords;



$text = ''; //text to contain general info, i.e "geo was done 21/08/1990 at 12.54pm". Used as global var in class MakeGeocodeCurlRequest()
$stuatus = "OK"; //status for ajax error handling
$newData = array(); //Array to contain ((adrr,coords), (adrr,coords) from Geocode result. //Used as global var in class MakeGeocodeCurlRequest()
	   
	   


//****************************************************************************
//copy data from  Master Excel file ('../excel_file.xlsx')  to Slave Excel and save it as 'Slave_data.xls' to the same folder where this script is located
//'Slave_data.xls' MUST BE CLOSED or u'll get "fopen failed to open stream: Permission denied"
if ( $xlsx = SimpleXLSX::parse('../excel_file.xlsx') ) {
    $masterExceldata =$xlsx->rows();   //gets the Master Excel file data via SimpleXLSX.php Library
    //$fp = fopen('Slave_data.xls', 'w+');
	
	$i = 0;
    foreach ($masterExceldata as $fields) {
		if($i != 0){ //skip header
		
            MakeGeocodeCurlRequest::makeCURLRequest($fields);		
	
		}
		    $i++;
    }
	
	//Save/write data to slave Excel file  with SimpleXLSXGen Library 
	$xlsxG = SimpleXLSXGen::fromArray($newData );
    $xlsxG->saveAs('Slave_data.xlsx');

    //fclose($fp);
	$text = "Master Excel file data was succesfully copied and geocoded to Slave Excel " . date("Y-m-d") . " at " .  date("h:i:sa"); 
	
	
	//echo json_encode($text);
    
} else {
	$stuatus = 'failed';
}
//End copy data from  Master Excel file ('../excel_file.xlsx')  to Slave Excel and save it as 'Slave_data.xls' to the same folder where this script is located











//*************************************************************
//sorting coords by distance (after geocoding is done and values are in 'Slave_data.xlsx')
$temoArrayWithCoordsAdresses = array(); //temp array to hold (adress, coords, distance in km(from START POINT)), will be used for usort() by distance
$Start_Point_Copenhagen = [12.592224, 55.679681]; //Start Point


	   
	   
	   

if ( $xlsx = SimpleXLSX::parse('Slave_data.xlsx') ) {
    $masterExceldata =$xlsx->rows();   //gets the Master Excel file data via SimpleXLSX.php Library
	
	$newData = array();
	$i = 0;
    foreach ($masterExceldata as $fields) {

		    
		    //getting address together from several columns 
		    $coordsColumn = $fields[1] ; //gets "9.267621, 55.430676"
			$addressColumn = str_replace("ø","o", $fields[0]); //replace danish{ø} with normal o
			$addressColumn = rawurlencode($addressColumn); //MegaFix ->  replace blankspace in 
			
			$colCoord = explode(",", $coordsColumn); //explode string "9.267621, 55.430676" to array
			
			//calc the distance in km between args. From included Class
			$distance = Calc_Distance_And_Sort_By_Coords::calcDistance($Start_Point_Copenhagen[0], $Start_Point_Copenhagen[1], $colCoord[0], $colCoord[1], "K") ;

            array_push($temoArrayWithCoordsAdresses, array($addressColumn, $coordsColumn, 'distance' => $distance)); //array(Volgade 8, "9.267621, 55.430676", 120km);
			
		 $i++;
	}
		
		//Array of coords before sorting
        /*echo "<pre>";		
		print_r($temoArrayWithCoordsAdresses);	
		echo "</pre>";*/
		
		
		//---------

		


	  //my custom function to sort array by distance, from short to longer distances. Used in usort() 
	  function myCompare_Distances($a, $b) {
          if($a['distance'] > $b['distance']) return 1;
          elseif($a['distance'] < $b['distance']) return -1;
          else return 0;
      }
   
       uasort($temoArrayWithCoordsAdresses, 'myCompare_Distances'); //arg (array to sort, myCustom Function)
	   //usort($temoArrayWithCoordsAdresses, ['Calc_Distance_And_Sort_By_Coords','myCompare_Distances']);

		//Array of coords after sorting by distance 
        /*echo "<br><pre>";		
		print_r($temoArrayWithCoordsAdresses);	
		echo "</pre>";*/	
} else {
	$stuatus = 'failed';
}

//form the URL for Google maps directions
$urlText = "https://www.google.com.ua/maps/dir/";
for ($i = 0; $i < count($temoArrayWithCoordsAdresses); $i++){
	//explode and reverse lat,long for Google maps
	$z = explode(",", $temoArrayWithCoordsAdresses[$i][1]);
	$urlText.= $z[1] . "," . $z[0] . "/";
}

//form whra to jsin_encode
$response = array(); 
$response ['status'] = $stuatus; //status for ajax error handling
$response ['text'] = $text;
$response ['url'] = $urlText;
//$response ['array'] = $temoArrayWithCoordsAdresses;

echo json_encode($response);

?>