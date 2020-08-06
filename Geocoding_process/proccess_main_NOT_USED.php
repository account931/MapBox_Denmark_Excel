<?php
//Fully working, but not used. It is a variant of calling this file directly, without ajax. Contains more complete code than proccess_main_via.ajax.php
error_reporting(E_ALL);

//uses https://github.com/shuchkin/simplexlsx to read Excel files
include "../Library/SimpleXLSX.php";

//MapBox Api keys
include "../Credentials/php_api_credentials/api_credentials.php";


//********************************************************************************************
//copy the Master Excel data to Slave Excel sheet and download slave excel file {Webinfopen.xls}. Must be before any other echo as it uses {headers}. Working!!!
//just copy the Master Excel data and immetiately download it as "Webinfopen.xls";
/*
if ( $xlsx = SimpleXLSX::parse('../excel_file.xlsx') ) {
$filename = "Webinfopen.xls"; // File Name

// Download file
header("Content-Disposition: attachment; filename=\"$filename\"");
header("Content-Type: application/vnd.ms-excel");
//$user_query = mysql_query('select name,work from info');

$masterExceldata =$xlsx->rows();

// Write data to file
$flag = false;

//while ($row = mysql_fetch_assoc($user_query)) {
foreach( $masterExceldata as $temp ) {
    if (!$flag) {
        // display field/column names as first row
        echo implode("\t", array_keys($temp)) . "\r\n";
        $flag = true;
    }
    echo implode("\t", array_values($temp)) . "\r\n";
}
}
*/
//copy the Master Excel data to Slave Excel sheet and download slave excel file {Webinfopen.xls}. Working!!!








//*************************************************************************
//Read and display data from Master Excel file ('../excel_file.xlsx'). Working!!!
echo '<h1>Parse Excel sheet.xslx</h1>';

//if successfully got the data from ../excel_file.xlsx via SimpleXLSX.php Library
if ( $xlsx = SimpleXLSX::parse('../excel_file.xlsx') ) {
	//print_r( $xlsx->rows() ); //print_r all the content of Excel file 
	
	echo '<table border="1" cellpadding="3" style="border-collapse: collapse">';
	foreach( $xlsx->rows() as $r ) {
		//echo '<tr><td>'.implode('</td><td>', $r ).'</td></tr>';  //show all rows
		
	    echo '<tr> <td>'. $r[0].'</td>  <td>'. $r[1]. '</td> <td>'. $r[2]. '</td> </tr>'; //show only specific rows

	}
	echo '</table>';
	// or $xlsx->toHTML();	
	
	
	
} else {
	echo SimpleXLSX::parseError();
}
echo '<pre>';
//End Read and display data from Master Excel file ('../excel_file.xlsx'). Working!!!



echo `whoami`; //echo dima-pc\dima

//BELOW IS FALSE, we got "fopen failed to open stream: Permission denied" ONLY IF THIS FILE IS ALREADY OPENED, so CLOSE IT.
//if Slave Excell file already exists, delete it before, as we have issue "fopen failed to open stream: Permission denied". It fires when trying to edit/rewrite existing file, but is OK if u create it.
/*
$file = 'Slave_data.xls';
if (file_exists($file)) {
    unlink($file);
}
*/



//****************************************************************************
//copy data from  Master Excel file ('../excel_file.xlsx')  to Slave Excel and save it as 'Slave_data.xls' to the same folder where this script is located
//'Slave_data.xls' MUST BE CLOSED or u'll get "fopen failed to open stream: Permission denied"
if ( $xlsx = SimpleXLSX::parse('../excel_file.xlsx') ) {
    $masterExceldata =$xlsx->rows();   //gets the Master Excel file data via SimpleXLSX.php Library
    $fp = fopen('Slave_data.xls', 'w+');

	$i = 0;
    foreach ($masterExceldata as $fields) {
		if($i != 0){ //skip header
		    
		    //getting address together from several columns 
		    $address = $fields[3] . " " . $fields[4] . " " . $fields[5]; // + " " + "Denmark";
			$address1 = str_replace("ø","o", $address); //replace danish{ø} with normal o
			$addressEncoded = rawurlencode($address1); //MegaFix ->  replace blankspace in address with %20 for geocode ok string (to use in $data_url), i.e "Trelle Ager 11 Syddanmark" turns to "Trelle%20Ager%2011%20Syddanmark "
			
			//get geocodining result & add to array() in fputcsv()
		    $data_url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'. $addressEncoded .'.json?country=dk&access_token='.ACCESS_TOKEN;
            echo $data_url . "</br>";
			// Gets the MapBox geo API
            /*if (!$json = file_get_contents($data_url)) {
		       echo "<br>MapBox Error</br>";
	        } else {
                 $result = json_decode($json,true);//,  true used for [], not  used  for '->';
			}
			*/
			
			
			
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
                   echo "cURL Error #:" . $err;
             } else {
                 //echo "<p> FEATURE STATUS=></p><p>Below is response from API-></p>";
                  //echo $response;
             }
  
			
			//var_dump($result);
			//echo "-> " . $result->type;
			$messageAnswer = json_decode(stripslashes($result), TRUE); //gets the cUrl response and decode to normal array
			if (json_last_error() == 0) { // you've got an object in $json}
			    echo "<p>No Json errors</p>";
		    } else {
				echo "<p>THERE IS A Json error</p>";
			}
			//var_dump($messageAnswer); 
			echo "count -> " . count($messageAnswer['features']);
			$finalCoords = $messageAnswer['features'][0]['center'][0] . ', ' . $messageAnswer['features'][0]['center'][1];
			echo 'coords -> ' . $finalCoords; 
			
			
			
			//data.features[0].center[1]
            fputcsv($fp, array($address1, $finalCoords ), "\t", '"'); //puts to Slave Excel file column 2,3  from Master Excel file
		}
		    $i++;
    }

    fclose($fp);
	echo "<p>Master Excel file data succesfully copied to Slave Excel " . date("Y-m-d") . " at " .  date("h:i:sa") . "</p>"; 
    
}
//End copy data from  Master Excel file ('../excel_file.xlsx')  to Slave Excel and save it as 'Slave_data.xls' to the same folder where this script is located





?>