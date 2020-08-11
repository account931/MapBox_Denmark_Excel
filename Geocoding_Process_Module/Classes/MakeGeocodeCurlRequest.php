<?php
//this class is 

namespace Classes\Geocoding; 




class MakeGeocodeCurlRequest {
	
    //private $UUID;  //unique ID for marker
    //private $messageArray = array();  //array to contain all Class messages to echo them all at once in the end with {function displayMessages()}
    //$text = global $text;


// 
// **************************************************************************************
// **************************************************************************************
// **                                                                                  **
// **                                                                                  **

public static function makeCURLRequest($fields){
			
			global $data;    //use global var from 'proccess_main_via_ajax.php'  //text to contain general info, i.e "geo was done 21/08/1990 at 12.54pm".
			global $newData; //use global var from 'proccess_main_via_ajax.php'. //Array to contain ((adrr,coords), (adrr,coords) from Geocode result.
			
			
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


// **                                                                                  **
// **                                                                                  **
// **************************************************************************************
// **************************************************************************************




} // end  Class
























?>
