//global variables
var popup;
var dataid;
var dataid_name;
var lastcollection_name;


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
                
                  tree_plantation (response.success)

                    lastcollection_name = response.success;

            			},


           			error: function (response) {


                  /*var myresp = response;
                  var win=window.open('about:blank');

                  with(win.document)
                  {
                    open();
                    write(response);
                    close();
                  }
                  */
                    if(response.responseText == '{"error":"collection_exists"}')

                    {

                      $('#db_exists_err').show();

                    }; //if closing



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
		
   			//$('#dataid_name')

         $('#viewdata').on('click',function(){

          $('#tableDiv').html( '<table id="example" class="display" cellspacing="0"></table>' );
          $.ajax( {
              "url": 'http://localhost:3000/displaydata?lastcollection=' + lastcollection_name,
              "success": function ( json ) {
                  $('#example').dataTable(json);
              },
              "dataType": "json"
       /* initialized in the back-end:
           buttons: [
            
            'excelHtml5',
            'csvHtml5',
            'pdfHtml5'
        ]*/
          } ); // closing table Div

          });// closing view_data button click  

      $('#viewjson').on('click',function(){

          $.ajax({
          url: '/displayjson?lastcollection=' + lastcollection_name,
          type: "get",
          datatype: "json",
     
              success: function (response) {

                //alert("OK");
               // $('#jsonDiv').append(response);
               $('#jsonDiv').jsonViewer(response);
               }, //succes closing



              error: function (response){

                }

            }); // closing ajax inside viewjson Modal
          });// closing view_json button click 


    $('#addcol').on('click',function(){



        $.ajax({
        url: "/getcolumn?collectionname=" + lastcollection_name,
        type: "get",
        datatype: "json",
     //   data: JSON.stringify(data),
     //   headers: {"content-type": "application/json"},
        success: function (response) {

        var data = response; 

        var text = '<select>';
        for(count = 0; count < data.length; count++){
           text += '<option value='+data[count]+'>'+data[count]+'</option>' 
            }
        text += '</select>';   
        text += '<select>';
        text += '<option value="+">+</option>'
        text += '<option value="-">-</option>'
        text += '<option value="*">*</option>'
        text += '<option value="/">/</option>'
        text += '</select>'; 

        text += '<select>';
        for(count = 0; count < data.length; count++){
           text += '<option value='+data[count]+'>'+data[count]+'</option>' 
            }
        text += '</select>';     

        $('#addColDiv').html(text);
            
          
          //$('#columnModal').modal('toggle');
          
          }, //succes closing

            error: function (response){

              }

          }); //closing ajax
          });// closing view_json button click 



}); //document ready closing
	

  
  		function doFunction(ele) {

  			//alert(ele);
  			ele.closest("div").remove();

  		};

	

  function tree_plantation (collectionname) {


    $.ajax({
    url: "/headers?collectionname=" + collectionname,
    type: "get",
    datatype: "json",
 //   data: JSON.stringify(data),
 //   headers: {"content-type": "application/json"},
    success: function (response) {

      //alert(response);
      // code to generate data tree
      $('#tree1').empty(); //to clear the div
      var data = response[0];
      
      $('#tree1').tree();  //resolves refresh issue for the tree

      $('#tree1').tree('loadData',data );   //loadData loads data in the empty tree
           // data: response[0] //previous method before loadData
        

        $('#tree1').bind(
        'tree.click',
        function(event) {
        //  alert(event.node.element.offsetTop); // to get the top position on click
      //  popup= 1;
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
        


      
      $('#myModal').modal('toggle');

      
      
      }, //succes closing



    error: function (response){

      }

  }); // ajax inside tree plantation closing


  }	//function tree plantation closing

  

     

