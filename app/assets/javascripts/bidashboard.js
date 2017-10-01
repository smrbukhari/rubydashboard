function static_plots() {

 	$.ajax({
    url: "/bidash_hw_audit",
    type: "get",
    datatype: "json",
    success: function (response) {
     // console.log(response);
      response.data.forEach(function(element){
        //console.log(element);
        var filter1 = document.getElementById('filter1');
        var filter2 = document.getElementById('filter2');
        filter1.options[filter1.options.length] = new Option(element,element);
        filter2.options[filter2.options.length] = new Option(element,element);
      });
    }, //success closing

 	 error: function (response){
    }
	}); //closing of first ajax main
}; //function close

$(document).ready(function(){

  $("#generate_plBarDiv1").click(function(){

    var filter1 = $('#filter1'), filter2 = $('#filter2');
    if(filter1.val() == 'Select Filter 1' || filter2.val() == 'Select Filter 2')
    {
      alert('Please select plot options first');
    }
    else
    {
      $.ajax({
        url: '/static_plot_generation?filter1=' + filter1.val() + '&filter2=' + filter2.val(),      type: "get",
        datatype: "json",
        success: function (response) {

          plotlyBarChart(response);

        },//success closing

        error: function (response){
          //console.log(response);
          alert('Filter Selection is incorrect!');
        }
      });
    }
    
  });
});




