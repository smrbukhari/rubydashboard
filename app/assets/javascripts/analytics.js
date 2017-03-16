$(window).load(function () {

	$('#plLineDiv').css('display', 'none');
 	//$('#mapid').css('display', 'none');

	
});
$(document).ready(function () {

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
    	$('#tree1').tree({
            data: response[0]
        });

        $('#tree1').bind(
    		'tree.click',
    		function(event) {
        	// The clicked node is 'event.node'
        	var node = event.node;
        	//alert(node.name);
        	$('.list').fadeIn(400);
			
			$(document).keyup(function(event) { //keypress event, fadeout on 'escape'
				if(event.keyCode == 27) {
					$('.list').fadeOut(400);
				}
			});
   		
   		 }
		
		);


    	}, //succes closing

    error: function (response){

    	}

	}); // ajax closing

			//$('.size').styleddropdown();

		   	

}); //document ready closing
	

		(function($){
	$.fn.styleddropdown = function(){
		return this.each(function(){
			var obj = $(this)
			obj.find('.field').click(function() { //onclick event, 'list' fadein
			obj.find('.list').fadeIn(400);
			
			$(document).keyup(function(event) { //keypress event, fadeout on 'escape'
				if(event.keyCode == 27) {
				obj.find('.list').fadeOut(400);
				}
			});
			
			obj.find('.list').hover(function(){ },
				function(){
					$(this).fadeOut(400);
				});
			});
			
			obj.find('.list li').click(function() { //onclick event, change field value with selected 'list' item and fadeout 'list'
			obj.find('.field')
				.val($(this).html())
				.css({
					'background':'#fff',
					'color':'#333'
				});
			obj.find('.list').fadeOut(400);
			});
		});
	};
})(jQuery);
