var FiltersHelper = {
  clearSelectOptions: function(element){
    var element_len = element.options.length;
    for (var i=0; i<element_len; i++){
      element.options.remove(0);
    }
  },
  handleSuccess: function(element){
   var filter1_options = document.getElementById('filter1_options');
    FiltersHelper.clearSelectOptions(filter1_options);
    response.data.forEach(function(element){
      filter1_options.options[filter1_options.options.length] = new Option(element,element); 
    });
    $('#filter1_options').prop('disabled',false);
    $('#filter1_options').select2();
    $('#filter1_options').trigger("change"); 
  },

  fetchSubOptions: function(element){
    $.ajax({
      url: '/filter_sub_options?filter=' + $(this).val(),
      type: "get",
      datatype: "json",
      success: function (response) {
           
      },//success closing

      error: function (response){
        //console.log(response);
        alert('Filter Selection is incorrect!');
      }
    });
  },
}


