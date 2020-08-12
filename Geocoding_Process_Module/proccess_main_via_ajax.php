<?php
//Truncated variant of proccess_main_NOT_USED.php. See source code there.
//accessed via ajax for better UI/UX, though can work directly after some amendments
//namespace main;
error_reporting(E_ALL);
//ini_set('xdebug.max_nesting_level', 400);

//uses https://github.com/shuchkin/simplexlsx to read Excel files
include "../Library/SimpleXLSX.php";


//uses https://github.com/shuchkin/simplexlsxgen to write Excel files
include "../Library/SimpleXLSXGen.php";


//MapBox Api keys
include "../Credentials/php_api_credentials/api_credentials.php";

//include Classes
include "Classes/MakeGeocodeCurlRequest.php";
include "Classes/Calc_Distance_And_Sort_By_Coords.php";
include "Classes/Create_GoogleMaps_Link.php";


use Classes\Geocoding\MakeGeocodeCurlRequest; //namespace for Class MakeGeocodeCurlRequest
use Classes\SortingDistance\Calc_Distance_And_Sort_By_Coords;
use Classes\LinkCreate\Create_GoogleMaps_Link ;




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
    if($xlsxG->saveAs('Slave_data.xlsx')){

    //fclose($fp);
	$text = "Master Excel file data was succesfully copied and geocoded to Slave Excel " . date("Y-m-d") . " at " .  date("h:i:sa"); 
	} else {
		$text = 'Copying and geocoding to Slave Excel Failed. Make sure Excel files are closed and u have installed CURL ';
	}
	
	//echo json_encode($text);
    
} else {
	$stuatus = 'failed';
}
//End copy data from  Master Excel file ('../excel_file.xlsx')  to Slave Excel and save it as 'Slave_data.xls' to the same folder where this script is located











//*************************************************************
$Start_Point_Copenhagen = [12.592224, 55.679681]; //Start Point

//sorting coords by distance (after geocoding is done and values are in 'Slave_data.xlsx'). Sort and then create Google map link with direction
$v = new Create_GoogleMaps_Link();
$urlText = $v->createLink($Start_Point_Copenhagen ); //args(arrayFromExcel, startPoint[alt, lon])



//form the Script Respones, what to json_encode
$response = array(); 
$response ['status'] = $stuatus; //status for ajax error handling
$response ['text'] = $text;
$response ['url'] = $urlText;
//$response ['array'] = $temoArrayWithCoordsAdresses;

echo json_encode($response);

?>