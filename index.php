
<!doctype html>
<!--------------------------------Bootstrap  Main variant ------------------------------------------>
  <html lang="en-US">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="Content-Type" content="text/html">
      <meta name="description" content="MapBox Store Location" />
      <meta name="keywords" content="MapBox Store Location">
      <title>MapBox Store Location </title>
  
      <!--Favicon-->
      <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon">

      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> <!-- fa-fa images library-->
      <link rel="stylesheet" type="text/css" media="all" href="css/mapbox_store_location.css"> <!-- main CSS-->
	  <link rel="stylesheet" type="text/css" media="all" href="css/switch_checkbox.css">  <!-- switch checkbox CSS--> 
	  <link rel="stylesheet" type="text/css" media="all" href="css/infoBox.css">  <!-- infoBox CSS-->
	  <link rel="stylesheet" type="text/css" media="all" href="css/preloader.css">  <!-- Preloader CSS-->
	  
	 <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.js'></script> <!-- Mapbox L JS -->
     <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.css' rel='stylesheet' /> <!-- Mapbox L JS -->
	 
	 

	  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	  <script src="Credentials/api_access_token.js"></script><!--  MapBox Access token -->
      <script charset="utf-8" src="js/mapbox_store_location.js"></script><!--  Core Mapbox JS -->
	  <script src="js/direction_api.js"></script> <!-- draw route JS-->  
	  <script src="js/changeStyleTheme.js"></script> <!-- change wallpapers,changeStyleTheme JS-->  

	 
	  <meta name="viewport" content="width=device-width" />
	  
	  <!--Favicon-->
      <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon">

     </head>

     <body>  
	 
	





       <div id="headX" class="jumbotron text-center gradient alert-success my-background head-style" style ='background-color:#2ba6cb;'> <!--#2ba6cb;-->
         <h1 id="h1Text"> <span id="textChange"> Test Locations</span></h1>
		 <p style='font-size:0.8em;margin-top:2em;'>Все места (Hovested, Sjælland, Syddanmark, Midtjylland, Nordjylland) можно увидеть в списке Select или уменьшив масштаб</p>
         <span id="start_end_direction_info"></span> <!-- start/end coordinates for direction API-->	
         
		  <!-- SELECT Dropdown for markers -->
          <p id="markerDropdown"></p>	
          <!-- END SELECT Dropdown for markers -->		  
		  
	   </div>
       
         <div class="wrapper grey App">
    	     <div class="container">
		         <div class="row row1">
			 
				 
				 
				      
				    
				        
					  
					  
				 
				      <!-------------- Mapbox main window ------------->
				          <div class="col-sm-12 col-xs-12" id="">
						      <div id='ETA' class="col-sm-6 col-xs-6"></div>  <!---- ETA hidden window ------>
						      <div id='map' style='width: 80%; height: 400px;'></div> <!-- Maps Window goes here -->
							  <pre id='info'></pre> <!-- Mouse coords go here -->
				          </div>
				          <br><br><br>
				      <!-------------- END  Mapbox main window ------------->
				 
				 
				 
				      
				 
				 
				 
				   
				      <!-------------- infoBox, display the status of running proccess, shows info on black background ----------------->
				      <div id="infoBox" class="col-sm-8 col-xs-8">
					      <span class="close-span iphoneX">x</span>  
					  </div>
					  <!-------------- END infoBox, display the status of running proccess, shows info on black background ----------------->
					  
					  
					  
					  
					  <!-------------- infoBox, display the status of running, shows info ----------------->
				      <div id="techInfo" class="col-sm-12 col-xs-12">
					      <h3>Tech Info</h3>
					  </div>
					  <!-------------- END infoBox, display the status of running, shows info ----------------->
					  
					  
					  

					  
				   
			      </div>  <!-- END class="row row1"> -->
				  

	 
    		</div><!-- /.container -->	  		
         </div><!-- /.wrapper -->
        
               

			   
			   
			   
			   
		 
		 
		 
	
			   
			   
			   
			   
			   
			   
	<!-----------------  Modal window "INFORMATION" shows list of all Dataset markers ----------------------------->
      <div id="myModalInfo" class="modal fade" role="dialog">
          <div class="modal-dialog">
          <!-- Modal content-->
              <div class="modal-content">
                  <div class="modal-header">
                       <button type="button" class="close" data-dismiss="modal">&times;</button>
                       <h4 class="modal-title">List of your Places Markers </h4>
                  </div>
                  <div class="modal-body">
				      <center>
				      <i class="fa fa-folder-open-o fa-my" style="font-size:36px"></i><br> <br>
					  
	                  <br></hr class="red">
					  
					  <!-- List of markers-->
                      <p id="list_of_markers" style="text-align:left;">
							<!-- here goes JS List -->
					  </p>
					  </center>
                  </div>
                  <div class="modal-footer">
				       
                       <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                  </div>
              </div>

         </div>
     </div>
   <!-----------------  END Modal window "INFORMATION" shows list of all Dataset markers ---------------------------->   
			   
			   
			   
			   
			   
			   
			   


           <!----------- Hidden preloader indicator when saving, hidden by default, must be outside class="App"  ------>
					  <div class="error-parent">
					      <h2 id="save_delete_text">  </h2>
		                  <span id='error_loading'>
			                  <img src="images/loader.gif"  class="error-img" alt="logo" />  
		                  </span>  
		              </div>
			<!----------- Hidden loading copy indicator ------->


					  
          <br><br><br> <br><br><br>

				
    	          
   	
		
			      <!-----------------  Button to change Style theme------------------------->
	              <input type="button" class="btn" value=">>" id="changeStyle" style="position:absolute;top:0px;left:0px;border:1px solid black;" title="click to change theme"/>
	              <!-----------------  Button to change Style theme------------------------->
				  
				  
				  <!-----------------  Button to show/hide MapBox GL LineString ------------------------->
	              <input type="button" class="btn" value="Show Route Line" id="LineStringShowHide" style="position:absolute;top:0em;left:3.3em; border:1px solid black;" title="LineString"/>
	              <!-----------------  Button to show/hide MapBox GL LineString------------------------->
				  
				  
				  
				  <!------------------- Checkbox Direction MODE, absolute position, top left ------------------->
				  <!--<div style="position:absolute; top:40px; left:1px;" title="Direction Mode">
				   &nbsp;&nbsp;<br>
				  <label class="switch">
                      <input type="checkbox" id="myCheck">
                          <span class="slider round"></span>
                  </label> 
				  </div>-->
                  <!-------------------  END Checkbox Direction MODEP, absolute position, top left ------------------------------------->
				  
				  
				 
				  
				  
				
				 
				   <!-----------------  Button with info------------------------------------>
	               <!--data-toggle="modal" data-target="#myModalZ" is a Bootstrap trigger---->
	               <button data-toggle="modal" data-target="#myModalInfo" class="btn" style="font-size:17px; position:absolute;top:0px;right:0px;border:1px solid black;" title="click to see info">
	               &nbsp;<i class="fa fa-info-circle"></i>&nbsp;
	               </button>    
	               <!-----------------  Button with info------------------------------------>
	   
	   
				 
				 <!---------------------------------- Link to show/hide markers--------------------------->
				 <p class="upload"><a class="iphoneX" id="markerShowHide" href="#">Hide marks</a></p> <!-- Link to upload-->
				  
				  
				  
		
		          <!------------- Footer ------------->
				  <div class="footer "> <!--navbar-fixed-bottom  fixxes bootom problem-->
				      Contact: <strong></strong><br>
					  <?php  echo date("Y"); ?>
				  </div>
		          <!------------ END Footer ----------->  
		
		

		
		
		
		
     
	  
    </body>
</html>





