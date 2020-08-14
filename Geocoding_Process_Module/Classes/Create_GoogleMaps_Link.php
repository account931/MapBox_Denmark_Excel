<?php
//this class is 

namespace Classes\LinkCreate; 

//uses https://github.com/shuchkin/simplexlsx to read Excel files
//include "../Library/SimpleXLSX.php";

use SimpleXLSX;
use Classes\SortingDistance\Calc_Distance_And_Sort_By_Coords;

class Create_GoogleMaps_Link {
 


  //sorting coords by distance (after geocoding is done and values are in 'Slave_data.xlsx'). Sort and then create Google map link with direction
  // **************************************************************************************
  // **************************************************************************************
  // **                                                                                  **
  // **                                                                                  **
  public  function createLink($Start_Point_Copenhagen, $masterExceldata) {
	  
      $temoArrayWithCoordsAdresses = array(); //temp array to hold (adress, coords, distance in km(from START POINT)), will be used for usort() by distance
      //global $stuatus; //use global var from 'proccess_main_via_ajax.php
   
      //add 1 start point to array (hard-coded)
      array_push($temoArrayWithCoordsAdresses, array('Copenhagen',implode(",", $Start_Point_Copenhagen) , 'distance' => 0));

      
	
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

		
         uasort($temoArrayWithCoordsAdresses, [$this, 'myCompare_Distances']);
         //uasort($temoArrayWithCoordsAdresses, 'myCompare_Distances'); //arg (array to sort, myCustom Function)
	     //usort($temoArrayWithCoordsAdresses, ['Calc_Distance_And_Sort_By_Coords','myCompare_Distances']);

		 //Array of coords after sorting by distance 
         /*echo "<br><pre>";		
		 print_r($temoArrayWithCoordsAdresses);	
		 echo "</pre>";*/	
		 
		 //form the URL for Google maps directions
         $urlText = "https://www.google.com.ua/maps/dir/";
         for ($i = 0; $i < count($temoArrayWithCoordsAdresses); $i++){
	         //explode and reverse lat,long for Google maps
	         $z = explode(",", $temoArrayWithCoordsAdresses[$i][1]);
	         $urlText.= $z[1] . "," . $z[0] . "/";
         }
	
  
    

    return $urlText;
      	    
}


// **                                                                                  **
// **                                                                                  **
// **************************************************************************************
// **************************************************************************************




	

// **************************************************************************************
// **************************************************************************************
// **                                                                                  **
// **                                                                                  **
     //my custom function to sort array by distance, from short to longer distances. Used in usort() 
	  public function myCompare_Distances($a, $b) {
          if($a['distance'] > $b['distance']) return 1;
          elseif($a['distance'] < $b['distance']) return -1;
          else return 0;
      }

// **                                                                                  **
// **                                                                                  **
// **************************************************************************************
// **************************************************************************************
		


} // end  Class

?>
