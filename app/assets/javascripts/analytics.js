//notes: 
// html class cam be called using $(".class") and id can be called using $("#id")
// ajax can be used to exchange data with the server and updating parts of web pages 
// without reloading the web page
// this javascript contains front-end code for BI Analytics Application

//global variables
var popup;
var dataid;
var dataid_name;
var lastcollection_name;
var columndata;
var selected_col1;
var selected_row1;


$(window).load(function (){
	$('#plLineDiv').css('display','none');
 	//$('#mapid').css('display', 'none');
});


  // ******************* (document).ready opening *******************
  $(document).ready(function (){
    popup = 0; //logic to disable popup in document.ready
    /*var values = [];
    $('#dropdown option').each(function() { 
        values.push( $(this).attr('value') );
    });


    $('#dropdown').on('change',function(){
      var i;
      for (i = 0; i < values.length; ++i){
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
    });  //closing dropdown change*/ 

	
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
  	$("#date_picker").slider({
    });


		//$('.size').styleddropdown();
    $("#loadcollection").on('click',function () {

      tree_plantation ($("#select_collection option:selected").val());
      lastcollection_name = $("#select_collection option:selected").val();  
    });  //closing for load previous collectiom


	  //code for upload dialog box 
		$('#file').on('change',function () {

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
                 
            tree_plantation (response.success);
            lastcollection_name = response.success;
            $('#mycollection').val("");
        },
   			error: function (response) {

            if(response.responseText == '{"error":"collection_exists"}')
            {
              $('#db_exists_err').show();
            }; //if closing
        }
      }); //ajax closing
   		
   	}); //file change closing 

    // Code for send to row and send to col data transfer to div
    selected_col1 = '';
    selected_row1 = '';
		$('#s2col').on('click',function (event) {				
			dataid_name = dataid.name;
			$('.data_col').empty().append("<div><div class='btn-info' style='display: inline-block; border-radius: 5px; font-weight:bold; '> " + dataid.name + "<span id="+ dataid.name +" onclick='doFunction("+ dataid.name +");' style='display: inline-block; border-radius: 5px; font-weight:bold; margin-left: 5px; cursor: pointer; cursor: hand;'>&#10006;</span></div></div>");
      selected_col1 = dataid.name; 
      if(selected_col1 != '' && selected_row1 != ''){
       enableMarks(selected_col1,selected_row1);
      }
    }); // closing for s2col

		$('#s2row').on('click',function (event) {
			dataid_name = dataid.name;				
		  $('.data_row').empty().append("<div><div class='btn-info' style='display: inline-block; border-radius: 5px; font-weight:bold; '> " + dataid.name + "<span id="+ dataid.name +" onclick='doFunction("+ dataid.name +");' style='display: inline-block; border-radius: 5px; font-weight:bold; margin-left: 5px; cursor: pointer; cursor: hand;'>&#10006;</span></div></div>");
		  selected_row1 = dataid.name;
      if(selected_col1 != '' && selected_row1 != ''){
       enableMarks(selected_col1,selected_row1);
      } 
    }); // closing for s2row
		  			

    $('#viewdata').on('click',function(){
      $('#tableDiv').html('<table id="example" class="display" cellspacing="0"></table>');
        $.ajax({
          "url": 'http://localhost:3000/displaydata?lastcollection=' + lastcollection_name,
          "success": function (json){
            $('#example').dataTable(json);
          },
          "dataType": "json"
        }); // closing ajax under table div
    });// closing view_data button click  

    $('#viewjson').on('click',function(){
      $.ajax({
        url: '/displayjson?lastcollection=' + lastcollection_name,
        type: "get",
        datatype: "json",
        success: function(response){
         $('#jsonDiv').jsonViewer(response);
         }, //succes closing
        error: function(response){
        }
      }); // closing ajax inside viewjson Modal
    });// closing view_json button click 


    $('#getcol').on('click',function(){
      $('#newcolname').val("");
      $.ajax({
        url: "/getcolumn?collectionname=" + lastcollection_name,
        type: "get",
        datatype: "json",
        success: function (response) {
          var data = response; 
          columndata = data;  
          var text = '<div class="col-sm-4"><select style="float: left;width: 250px;height: 40px;font-size: 16px;text-align: left;display: inline;" id="col_one">';
          text += '<option  disabled selected>Select First Column</option>'
          for(count = 0; count < data.length; count++){
             text += '<option value='+data[count]+'>'+data[count]+'</option>' 
            }
          text += '</select></div>';   
          text += '<div class="col-sm-4"><select id="math_opr" style="float: left;width: 250px;height: 40px;font-size: 16px;text-align: left;display: inline;">';
          text += '<option  disabled selected>Select Operator</option>'
          text += '<option value="add">+</option>'
          text += '<option value="subtract">-</option>'
          text += '<option value="multiply">*</option>'
          text += '<option value="divide">/</option>'
          text += '</select></div>'; 
          text += '<div class="col-sm-4"><select style="float: left;width: 250px;height: 40px;font-size: 16px;text-align: left;display: inline;" id="col_two">';
          text += '<option  disabled selected>Select Second Column</option>'
          for(count = 0; count < data.length; count++){
             text += '<option value='+data[count]+'>'+data[count]+'</option>' 
            }
          text += '</select></div>';     

          $('#addColDiv').html(text);
          //$('#columnModal').modal('toggle');
        }, //succes closing
        error: function (response){  
        }
      }); //closing ajax
    });// closing view_json button click 

    //routine to update column button from add --> update 
    $("#newcolname").on('change keyup paste', function(){
      if($.inArray($("#newcolname").val(),columndata) >= 0){
        $('#addColButton').text('Update Column');
        //  console.log("succ matched");
      }
      else{
      $('#addColButton').text('Add Column');
      }
      //console.log(columndata);
    });

    //routine to Add Column to all documents in the table/collection
    $('#addColButton').on('click',function(){
      $.ajax({
        url: "/addcolumn?collectionname=" + lastcollection_name + "&nameofcolumn=" + $('#newcolname').val() + "&columnone=" +  $('#col_one').find(":selected").text() + "&mathoperator=" + $('#math_opr').find(":selected").val() + "&columntwo=" + $('#col_two').find(":selected").text(),
        type: "get",
        datatype: "json",
        //   data: JSON.stringify(data),
        //   headers: {"content-type": "application/json"},
        success: function (response){  
          tree_plantation (lastcollection_name); 
          $('#columnModal').modal('hide'); //use hide instead of toggle 
        }, //succes closing
        error: function (response){
        }

      }); //closing ajax
    });// closing addColButton button click 

    //routine to Add Empty Column to all documents in the table/collection
    $('#emptyColButton').on('click',function(){
      $.ajax({
        url: "/addemptycolumn?collectionname=" + lastcollection_name + "&nameofcolumn=" + $('#newcolname').val(),
        type: "get",
        datatype: "json",
        //   data: JSON.stringify(data),
        //   headers: {"content-type": "application/json"},
        success: function (response){ 
          tree_plantation (lastcollection_name);
          $('#columnModal').modal('hide'); //use hide instead of toggle   
        }, //succes closing

        error: function (response){
        }

      }); //closing ajax
    });// closing addColButton button click 

    //routine to give dropdown for previous existing databases  
    $('#importbutton').on('click',function(){
      $.ajax({
        url: "/usercollection",
        type: "get",
        datatype: "json",
        //   data: JSON.stringify(data),
        //   headers: {"content-type": "application/json"},
        success: function (response){
         // console.log(response);
         var text1 = '<select style="float: left;width: 190px;height: 32px;font-size: 16px;text-align: left;display: inline;margin-top: 10px;" id="select_collection"><option disabled="" selected="">Select Previous Table</option>'
         for(count = 0; count < response.length; count++){
           text1 += '<option value='+response[count]+'>'+response[count]+'</option>' 
          }
         text1 += '</select>';    
         $('#showcollection').html(text1);
         $('#mycollection').val("");

        }, //success closing

        error: function (response){
        } //error closing
      }); //closing ajax
    });
    disableMarks(); //to disable dropdown select Marks 
  }); // *******************document ready closing*******************
	

    // function to remove colsest div used in send2col and send2row 
  	function doFunction(ele){
  			//alert(ele);
  			ele.closest("div").remove();
  	};

    function disableMarks(){

      $("#dropdown").attr('disabled',true);

    };

    function enableMarks(colname,rowname){
      $("#dropdown").attr('disabled',false);
      //popup = 0;
      var values = [];
      $('#dropdown option').each(function() { 
          values.push( $(this).attr('value') );
      });


      $('#dropdown').on('change',function(){
        var i;
        for (i = 0; i < values.length; ++i){
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
          plotly_function(colname,rowname,lastcollection_name);
        }   
      });  //closing dropdown change
    };

	

    function tree_plantation (collectionname){
      $.ajax({
        url: "/headers?collectionname=" + collectionname,
        type: "get",
        datatype: "json",
        //   data: JSON.stringify(data),
        //   headers: {"content-type": "application/json"},
        success: function (response){
          // code to generate data tree
          $('#tree1').empty(); //to clear the div
          var data = response[0];
          $('#tree1').tree();  //resolves refresh issue for the tree
          $('#tree1').tree('loadData',data);   //loadData loads data in the empty tree
               // data: response[0] //previous method before loadData
          $('#tree1').bind('tree.click',function(event){
            if (event.node.children.length == 0){
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
          // add description for window click
          $(window).click(function(event) { //keypress event, fadeout on 'escape'  
            //alert(popup);
            if(popup == 1){
             $('.list-popup').fadeOut(400, function(){
                popup = 0;
              });
            } // if closing
          }); //function after window.click closing            
          $('#myModal').modal('hide');
        }, //succes closing
        error: function (response){  
        }
      }); // ajax inside tree plantation closing
    }	//function tree plantation closing

  

     

