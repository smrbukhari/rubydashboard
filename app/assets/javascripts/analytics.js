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


}); //document ready closing
	


