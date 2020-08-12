
(function(){ //START IIFE (Immediately Invoked Function Expression)

  $(document).ready(function(){

	
	//
	// **************************************************************************************
    // **************************************************************************************
    //                                                                                     ** 

	$(document).on("click", '#startGeocode', function() {   // this click is used to react to newly generated cicles;
	    $('.error-parent').show(); //show gif loader
		$('.App').addClass('blur');  //blur the background
		$('#processe_text').html('Geocoding, please wait');
		
		//ajax
		$.ajax({
            url: 'proccess_main_via_ajax.php',//my ajax url 
            type: 'POST',
			dataType: 'JSON', // without this it returned string(that can be alerted), now it returns object
			//passing the city
            data: { 
			    //serverCity:window.cityX
			},
            success: function(data) {
				setTimeout(function(){
				    $('.error-parent').hide(800); //hide gif loader
		            $('.App').removeClass('blur');  //blur the background
                    
					if(data.status == "OK"){
						swal("Success", "Geocoding is done successfuly", "success");
						var text = "<br><p>" + data.text + "</p>";
						text+= "<p><a href='" + data.url +  "' target='_blank'> Open route in Google maps </a></p>";
					    $('#ajaxResults').stop().fadeOut("slow",function(){ $(this).html(text)}).fadeIn(2000);
					} else {
						swal("Failed!", "There happens an error. Check if cURL is installed or make sure your Excel files are closed(therefor may prevent reading)", "warning");

					}

			}, 2000);
				
            },  //end success
			error: function (error) {
				$('.error-parent').hide(800);
		        $('.App').removeClass('blur');  //blur the background
				swal("Failed!", "There happens an error. Check if cURL is installed or make sure your Excel files are closed(therefor may prevent reading)", "warning");
				$('#ajaxResults').stop().fadeOut("slow",function(){ $(this).html('Geocoding Failed. There happens an error. Check if cURL is installed or make sure your Excel files are closed(therefor may prevent reading)')}).fadeIn(2000);

            }	
        });
		
	});
	 


  });
    // end ready		
	
}()); //END IIFE (Immediately Invoked Function Expression)




