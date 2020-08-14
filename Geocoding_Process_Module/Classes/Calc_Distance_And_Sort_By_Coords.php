<?php
//this class is to calc distance between 2 coords

namespace Classes\SortingDistance; 




class Calc_Distance_And_Sort_By_Coords {
	

 


//function to calc distance between 2 coords, return distance in km, used in usort() when sort array by distance. $temoArrayWithCoordsAdresses => https://www.geodatasource.com/developers/php
// **************************************************************************************
// **************************************************************************************
// **                                                                                  **
// **                                                                                  **

  public static function calcDistance($lat1, $lon1, $lat2, $lon2, $unit) {
      if (($lat1 == $lat2) && ($lon1 == $lon2)) {
          return 0;
      } else {
          $theta = $lon1 - $lon2;
          $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
          $dist = acos($dist);
          $dist = rad2deg($dist);
          $miles = $dist * 60 * 1.1515;
          $unit = strtoupper($unit);

          if ($unit == "K") {
              return ($miles * 1.609344);
          } else if ($unit == "N") {
              return ($miles * 0.8684);
          } else {
             return $miles;
          }
       }
 
 //echo calcDistance(32.9697, -96.80322, 29.46786, -98.53506, "M") . " Miles<br>";			    
}


// **                                                                                  **
// **                                                                                  **
// **************************************************************************************
// **************************************************************************************




	

// **************************************************************************************
// **************************************************************************************
// **                                                                                  **
// **                                                                                  **


// **                                                                                  **
// **                                                                                  **
// **************************************************************************************
// **************************************************************************************
		


} // end  Class

?>
