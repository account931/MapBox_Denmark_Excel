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





$text = '';




//****************************************************************************
//copy data from  Master Excel file ('../excel_file.xlsx')  to Slave Excel and save it as 'Slave_data.xls' to the same folder where this script is located
//'Slave_data.xls' MUST BE CLOSED or u'll get "fopen failed to open stream: Permission denied"
if ( $xlsx = SimpleXLSX::parse('../excel_file.xlsx') ) {
    $masterExceldata =$xlsx->rows();   //gets the Master Excel file data via SimpleXLSX.php Library
    //$fp = fopen('Slave_data.xls', 'w+');

	 
	$newData = array();
	$i = 0;
    foreach ($masterExceldata as $fields) {
		if($i != 0){ //skip header
		    
		    //getting address together from several columns 
		    $address = $fields[3] . " " . $fields[4] . " " . $fields[5]; // + " " + "Denmark";
			$address1 = str_replace("ø","o", $address); //replace danish{ø} with normal o
			$addressEncoded = rawurlencode($address1); //MegaFix ->  replace blankspace in address with %20 for geocode ok string (to use in $data_url), i.e "Trelle Ager 11 Syddanmark" turns to "Trelle%20Ager%2011%20Syddanmark "
			
			//get geocodining result & add to array() in fputcsv()
		    $data_url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'. $addressEncoded .'.json?country=dk&access_token='.ACCESS_TOKEN;
          
			
			
			
			$myCurl = curl_init();
                          curl_setopt($myCurl, CURLOPT_URL, $data_url);
						  curl_setopt($myCurl, CURLOPT_CUSTOMREQUEST, "GET");
                          //curl_setopt($myCurl, CURLOPT_POST, 1);  // $_POST['']
                          //curl_setopt($myCurl, CURLOPT_POSTFIELDS, urldecode(http_build_query($params))); //sends $_POST['']
                          curl_setopt($myCurl, CURLOPT_RETURNTRANSFER, true);
                          curl_setopt($myCurl, CURLOPT_SSL_VERIFYPEER, false);
                          $result = curl_exec($myCurl);
						  $err = curl_error($myCurl);
                          curl_close($myCurl);
			
			 if ($err) {
                   $text = "cUrl Failed";
             } else {
                 //echo "<p> FEATURE STATUS=></p><p>Below is response from API-></p>";
                  //echo $response;
             }
  
			
			
			$messageAnswer = json_decode(stripslashes($result), TRUE); //gets the cUrl response and decode to normal array
			if (json_last_error() == 0) { // you've got an object in $json}
			    //echo "<p>No Json errors</p>";
		    } else {
				//echo "<p>THERE IS A Json error</p>";
			}
			//var_dump($messageAnswer); 
			//echo "count -> " . count($messageAnswer['features']);
			$finalCoords = $messageAnswer['features'][0]['center'][0] . ', ' . $messageAnswer['features'][0]['center'][1];
			//echo 'coords -> ' . $finalCoords; 
			
			
			
			
            //fputcsv($fp, array($address1, $finalCoords ), "\t", '"'); //puts to Slave Excel file column 2,3  from Master Excel file
			
			 array_push($newData, array($address1, $finalCoords));
		}
		    $i++;
    }
	
	//Save/write data to slave Excel file  with SimpleXLSXGen Library 
	$xlsxG = SimpleXLSXGen::fromArray($newData );
    $xlsxG->saveAs('Slave_data.xlsx');

    //fclose($fp);
	$text = "Master Excel file data was succesfully copied and geocoded to Slave Excel " . date("Y-m-d") . " at " .  date("h:i:sa"); 
	
	
	echo json_encode($text);
    
}
//End copy data from  Master Excel file ('../excel_file.xlsx')  to Slave Excel and save it as 'Slave_data.xls' to the same folder where this script is located





?>