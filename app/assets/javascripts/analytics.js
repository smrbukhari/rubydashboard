//global variables
var popup;
var dataid;
var dataid_name;


$(window).load(function () {

	$('#plLineDiv').css('display', 'none');
 	//$('#mapid').css('display', 'none');

	
});
$(document).ready(function () {
popup = 0;

var values = [];
$('#dropdown option').each(function() { 
    values.push( $(this).attr('value') );
});
	

$('#dropdown').on('change',function () {

var i;
for (i = 0; i < values.length; ++i) {
    $('#' + values[i]).css('display','none');
}

if(this.value == 'mapid'){
	$('.col-sm-6').append("<div id='mapid'></div>");
	geo_function();
}
else{
	$('#mapid').remove();
 	rem_map();
	$('#' + this.value).css('display', 'block'); //main code to switch between graphs
 	plotly_function();
}		


});         //class needs a . and id needs a #

	
		$('#data').addClass("active"); // to make Data active on document ready
		$('#data_tab').addClass("active"); // to make Data active on document ready

		// Tab Javascript - Data
		$('#data_tab').on('click',function () {
		$('#data').addClass("active");
		$('#data_tab').addClass("active");
		$('#analytics_tab').removeClass("active");
		$('#analytics').removeClass("active");
	}); //closing data

	// Tab Javascript - Analytics
	$('#analytics_tab').on('click',function () {
		$('#analytics').addClass("active");
		$('#analytics_tab').addClass("active");
		$('#data_tab').removeClass("active");
		$('#data').removeClass("active");
	}); //closing analytics


	// Slider Opacity
	$('#opacity-slider').slider({
		formatter: function(value) {
			return 'Current value: ' + value;
		}
	});
 	
 	//Slider Date Picker
	$("#date_picker").slider({});



	$.ajax({
    url: "/headers",
    type: "get",
    datatype: "json",
 //   data: JSON.stringify(data),
 //   headers: {"content-type": "application/json"},
    success: function (response) {

    	//alert(response);
    	// code to generate data tree
    	
    	$('#tree1').tree({
            data: response[0]
        });

        $('#tree1').bind(
    		'tree.click',
    		function(event) {
    		//	alert(event.node.element.offsetTop); // to get the top position on click
    	//	popup= 1;
    		if (event.node.children.length == 0)
    		{
    		$('.list-popup').css('top', event.node.element.offsetTop + "px");
        	// The clicked node is 'event.node'
        	event.stopPropagation();
        	var node = event.node;
        	dataid = event.node;
        	//alert(node.name);
        	$('.list-popup').fadeIn(400, function(){
        		popup = 1;	
        	});
        	} //closing if
		}); //bind closing


   		
   		$(window).click(function(event) { //keypress event, fadeout on 'escape'
				
		if(popup == 1){
	
			$('.list-popup').fadeOut(400, function(){
				popup = 0;
			});
		}

		}); //function after window.click closing
   			



    	}, //succes closing



    error: function (response){

    	}

	}); // ajax closing

			//$('.size').styleddropdown();

		 //code for upload dialog box 
			$('#file').on('change',function () {
			
		   		//alert("test");

		   		var data = new FormData(); //only data is passed through ajax
        		data.append("file", $("#file")[0].files[0]); //create key value pair (file, file_data)
        		data.append("name", $("#mycollection").val());

        			$.ajax({
            		url: "/upload",
           			type: "post",
            		cache: false,
            		data: data,
            		dataType: 'json',
            		processData: false, // Don't process the files
            		contentType: false,
            		success: function (response) {
                
            			},


           			error: function (response) {

            			}
        }); //ajax closing
   		
   		 	}); //file change closing 

    // Code for send to row and send to col data transfer to div
			$('#s2col').on('click',function (event) {				
				//alert(dataid);
				dataid_name = dataid.name;
				$('.data_col').empty().append("<div><div class='btn-info' style='display: inline-block; border-radius: 5px; font-weight:bold; '> " + dataid.name + "<span id="+ dataid.name +" onclick='doFunction("+ dataid.name +");' style='display: inline-block; border-radius: 5px; font-weight:bold; margin-left: 5px; cursor: pointer; cursor: hand;'>&#10006;</span></div></div>");
    			}); // closing for s2col
   			$('#s2row').on('click',function (event) {
   				dataid_name = dataid.name;				
				$('.data_row').empty().append("<div><div class='btn-info' style='display: inline-block; border-radius: 5px; font-weight:bold; '> " + dataid.name + "<span id="+ dataid.name +" onclick='doFunction("+ dataid.name +");' style='display: inline-block; border-radius: 5px; font-weight:bold; margin-left: 5px; cursor: pointer; cursor: hand;'>&#10006;</span></div></div>");
    			}); // closing for s2row
		
   			$('#dataid_name')


}); //document ready closing
	
  
  		function doFunction(ele) {

  			//alert(ele);
  			ele.closest("div").remove();

  		};

		