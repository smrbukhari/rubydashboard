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
        var filter3 = document.getElementById('filter3');
        filter1.options[filter1.options.length] = new Option(element,element);
        filter2.options[filter2.options.length] = new Option(element,element);
        filter3.options[filter3.options.length] = new Option(element,element);
        $('.selectFilter').select2(); //initialize Select 2
      });
    }, //success closing

 	 error: function (response){
    }
	}); //closing of first ajax main
}; //function close

$(document).ready(function(){

  $("#filter1").change(function(){
    $.ajax({
        url: '/filter_sub_options?filter=' + $(this).val(),
        type: "get",
        datatype: "json",
        success: function (response) {
          var filter1_options = document.getElementById('filter1_options');
          FiltersHelper.clearSelectOptions(filter1_options);
          response.data.forEach(function(element){
            filter1_options.options[filter1_options.options.length] = new Option(element,element); 
          });
          $('#filter1_options').removeClass('hidden');
          $('#filter1_options').select2();
          $('#filter1_options').trigger("change");       

        },//success closing

        error: function (response){
          //console.log(response);
          alert('Filter Selection is incorrect!');
        }
    });
  });

  $("#filter2").change(function(){
    $.ajax({
        url: '/filter_sub_options?filter=' + $(this).val(),
        type: "get",
        datatype: "json",
        success: function (response) {
        //  console.log(response);
          response.data.forEach(function(element){
            var filter2_options = document.getElementById('filter2_options');
            filter2_options.options[filter2_options.options.length] = new Option(element,element); 
          });
          $('#filter2_options').removeClass('hidden');
          $('#filter2_options').select2();       

        },//success closing

        error: function (response){
          //console.log(response);
          alert('Filter Selection is incorrect!');
        }
    });
  });


  $("#generate_plBarDiv1").click(function(){

    var filter1 = $('#filter1'), filter2 = $('#filter2'), filter3 = $('#filter3'),
        filter1_options = $('#filter1_options'), filter2_options = $('#filter2_options');
    if(filter1.val() == 'Select Filter 1' || filter2.val() == 'Select Filter 2' || filter3.val() == 'GroupBy')
    {
      alert('Please select plot options first');
    }
    else
    {
      $.ajax({
        url: '/static_plot_generation', 
        data: { 
          filter1: filter1.val(), 
          filter1_option: filter1_options.val(), 
          filter2: filter2.val(),
          filter2_option: filter2_options.val(),
          filter3: filter3.val()
        },
        type: "get",
        datatype: "json",
        success: function (response) {

          plotlyBarChart(response);
          console.log(response);

        },//success closing

        error: function (response){
          //console.log(response);
          alert('Filter Selection is incorrect!');
        }
      });
    }
    
  });
});



