$(document).ready(function(){
  document.getElementById("default_union").checked = true;
  BiSquare.FiltersHelper.uncheckCheckboxes();
  BiSquare.BiDashboardHelper.staticPlotsInitialize();
  BiSquare.FiltersHelper.handleFilterChange('filter1', 'filter1_options', 'filter1_options_select_all');
  BiSquare.FiltersHelper.handleFilterChange('filter2', 'filter2_options', 'filter2_options_select_all');
  BiSquare.FiltersHelper.handleSelectAllCheckAndUncheck('filter1_options_select_all', 'filter1_options');
  BiSquare.FiltersHelper.handleSelectAllCheckAndUncheck('filter2_options_select_all', 'filter2_options');
  //  geo_function();

  $("#generate_plBarDiv1").click(function() {
    BiSquare.BiDashboardHelper.staticPlotGeneration({filter1Id: 'filter1', filter2Id: 'filter2', filter3Id: 'filter3', filter4Id: 'filter4',
      subFilter1Id: 'filter1_options', subFilter2Id: 'filter2_options'});
  });
  $("#viewDataButton").click(function() {
    $('#viewDataTableDiv').html('<table id="example" class="display" cellspacing="0"></table>');
        $.ajax({
          url: '/ericsson/hw_inv_audit/view_data',
          data: {
            filter1: $("#filter1").val(),
            filter1_option: $("#filter1_options").val(),
            filter2:  $("#filter2").val(),
            filter2_option: $("#filter2_options").val(),
            //filter3: filter3.val(),
            //filter4: filter4.val(),
          },
          type: "get",
          datatype: "json",
          "success": function (json){
            $('#example').dataTable(json);
          },
          "dataType": "json"
        }); // closing ajax under table div
  });
});
