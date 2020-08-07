
<!doctype html>
<!--------------------------------Bootstrap  Main variant ------------------------------------------>
  <html lang="en-US">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="Content-Type" content="text/html">
      <meta name="description" content="Geocoding panel" />
      <meta name="keywords" content="Geocoding panel">
      <title>Geocoding panel</title>
  


      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> <!-- fa-fa images library-->
	  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.css"> <!--Sweet Alert CSS -->

      <link rel="stylesheet" type="text/css" media="all" href="css/geocode_process.css"> <!-- main CSS-->
	  <link rel="stylesheet" type="text/css" media="all" href="css/preloader.css">  <!-- Preloader CSS-->
	  
	 
	 

	  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	  <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script> <!--Sweet Alert JS-->


	  <script src="../js/changeStyleTheme.js"></script> <!-- change wallpapers,changeStyleTheme JS--> 
      <script src="js/geocode_process.js"></script> <!-- geocode_process JS-->  	  

	 
	  <meta name="viewport" content="width=device-width" />
	  
	  <!--Favicon-->
      <link rel="shortcut icon" href="../images/favicon.ico" type="image/x-icon">

     </head>

     <body>  
	 
	





       <div id="headX" class="jumbotron text-center gradient alert-success my-background head-style" style ='background-color:#60b1f0;color:white;'> <!--#2ba6cb;-->
         <h1 id="h1Text"> <span id="textChange"> Geocode places from Excel</span></h1>
		 <p style='font-size:0.8em;margin-top:2em;'>Press button to start geocoding</p>	  
	   </div>
       
         <div class="wrapper grey App">
    	     <div class="container">
		         <div class="row row1">
			     	  
				 
				     <!-------------- Geocode button ------------->
				          <div class="col-sm-12 col-xs-12">
						      <center>
						          <button id="startGeocode" class="start-geo-btn" style="font-size:34px">Start Geocoding <i class="fa fa-cubes"></i></button> 
							  </center>
				          </div>
				     <!-------------- END  Geocode button  ------------->
				 		

					   <!-------------- Ajax resul8uts go here ------------->
				       <div class="col-sm-12 col-xs-12" id="ajaxResults">
					   </div>
				       <!-------------- END  Ajax resul8uts go here  ------------->
						  
				   
			      </div>  <!-- END class="row row1"> -->
				  

	 
    		</div><!-- /.container -->	  		
         </div><!-- /.wrapper -->
        
               



           <!----------- Hidden preloader indicator when saving, hidden by default, must be outside class="App"  ------>
			<div class="error-parent">
			    <h2 id="processe_text">  </h2>
		        <span id='error_loading'>
			        <img src="../images/loader.gif"  class="error-img" alt="logo" />  
		        </span>  
		    </div>
			<!----------- Hidden loading copy indicator ------->


					  
          <br><br><br> <br><br><br>

				
    	          
   	
		
			      <!-----------------  Button to change Style theme------------------------->
	              <input type="button" class="btn" value=">>" id="changeStyle" style="position:absolute;top:0px;left:0px;border:1px solid black;" title="click to change theme"/>
	              <!-----------------  Button to change Style theme------------------------->
				  
				  
				 
				  
				  
		
		          <!------------- Footer ------------->
				  <div class="footer"> <!--navbar-fixed-bottom  fixxes bootom problem-->
				      Contact: <strong></strong><br>
					  <?php  echo date("Y"); ?>
				  </div>
		          <!------------ END Footer ----------->  
		
		

		
     
	  
    </body>
</html>