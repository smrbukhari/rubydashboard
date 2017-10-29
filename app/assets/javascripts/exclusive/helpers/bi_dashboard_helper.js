BiSquare.BiDashboardHelper = {
  staticPlotsInitialize: function() {
    $.ajax({
      url: "/bidash_hw_audit",
      type: "get",
      datatype: "json",
      success: function (response) {
        BiSquare.FiltersHelper.populateFilters(['filter1', 'filter2', 'filter3', 'filter4'], response.data);
        BiSquare.FiltersHelper.select2Initialization();
      }, //success closing
   	 error: function (response){
     },
  	}); //closing of first ajax main
  },
  staticPlotGeneration: function(settings) {
    var filter1 = $('#' + settings.filter1Id), filter2 = $('#' + settings.filter2Id), filter3 = $('#' + settings.filter3Id), filter4 = $('#' + settings.filter4Id),
        filter1_options = $('#' + settings.subFilter1Id), filter2_options = $('#' + settings.subFilter2Id);
    if(filter1.val() == 'Select Filter 1' || filter2.val() == 'Select Filter 2' || filter3.val() == 'GroupBy')
    {
      alert('Please select plot options first');
    } else {
      $.ajax({
        url: '/static_plot_generation',
        data: {
          filter1: filter1.val(),
          filter1_option: filter1_options.val(),
          filter2: filter2.val(),
          filter2_option: filter2_options.val(),
          filter3: filter3.val(),
          filter4: filter4.val()
        },
        type: "get",
        datatype: "json",
        success: function(response) {
          plotlyBarChart(response);
        },//success closing
        error: function(response) {
          alert('Filter Selection is incorrect!');
        }
      });
    }
  },
};
