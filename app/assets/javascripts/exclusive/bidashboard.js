$(document).ready(function(){
  BiSquare.FiltersHelper.uncheckCheckboxes();
  BiSquare.BiDashboardHelper.staticPlotsInitialize();
  BiSquare.FiltersHelper.handleFilterChange('filter1', 'filter1_options', 'filter1_options_select_all');
  BiSquare.FiltersHelper.handleFilterChange('filter2', 'filter2_options', 'filter2_options_select_all');
  BiSquare.FiltersHelper.handleSelectAllCheckAndUncheck('filter1_options_select_all', 'filter1_options');
  BiSquare.FiltersHelper.handleSelectAllCheckAndUncheck('filter2_options_select_all', 'filter2_options');

  $("#generate_plBarDiv1").click(function() {
    BiSquare.BiDashboardHelper.staticPlotGeneration({filter1Id: 'filter1', filter2Id: 'filter2', filter3Id: 'filter3', filter4Id: 'filter4',
      subFilter1Id: 'filter1_options', subFilter2Id: 'filter2_options'});
  });
});
