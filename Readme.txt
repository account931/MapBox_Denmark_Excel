 //=================================   
 #Stack:
   #read Excel files with SimpleXLSX Lib -> https://github.com/shuchkin/simplexlsx  => see 'Geocoding_Process_Module/proccess_main_via_ajax.php'
   #write Excel files with SimpleXLSXGen Lib -> https://github.com/shuchkin/simplexlsxgen 
   # sort coordinates array by distance (PHP => see 'Geocoding_Process_Module/proccess_main_via_ajax.php' 
                                       and JS => )
   # MapBox Direction Api (js/direction_api.js)
   # MapBox markers (js/mapbox_store_location.js)
   
 //=================================  
 
   What is does:
 #Projet has 2 index.php, 
       1st -> 'root/index.php', it reads Slave Excel file 'Geocoding_Process_Module/Slave_data.xlsx' via ajax(js/mapbox_store_location.js -> /ajax/getCoordsListFromSlaveExcel.php), gets coords from Excel column and build mapBox map with markers.
       2nd -> '/Geocoding_Process_Module/index.php', onClick it reads Master Excel file  "/excel_file.xlsx", concatenate excel columns with addresses,
	       makes cURL request to MapBox Geocoding Api, then saves adresses and found coords to Slave Excel '/Geocoding_Process_Module/Slave_data.xlsx', 
		   then reads 'Slave_data.xlsx', gets coords to temp array, calc the distance between START POINT and every coordinate, push distanace to this temp array, make usort(), to sort by distance and generate Google Maps Directions url link (that draws line between all routes places)
	       It is made via ajax('/Geocoding_Process_Module/js/geocode_process.js') ->  'Geocoding_Process_Module/proccess_main_via_ajax.php'          
					   
 # Script '/Geocoding_Process_Module/proccess_main_via_ajax.php' when is launched via ajax from '/Geocoding_Process_Module/index.php' <==> with js '/Geocoding_Process_Module/js/geocode_process.js'
    reads Master Excel file "/excel_file.xlsx" columns "", concatenates adress and makes cUrl request to MapBox Api to geocode addresses to coords,
	then writes them to slave Excel '/Geocoding_Process_Module/Slave_data.xlsx'
 # Main root file "index.php" being launche.......
 

   