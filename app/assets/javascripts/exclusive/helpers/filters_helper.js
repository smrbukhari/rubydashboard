BiSquare.FiltersHelper = {
  clearSelectOptions: function(element) {
    var element_len = element.options.length;
    for (var i=0; i<element_len; i++){
      element.options.remove(0);
    }
  },
  uncheckCheckboxes: function() {
    $('#filter1_options_select_all').prop('checked', false);
    $('#filter2_options_select_all').prop('checked', false);
  },
  populateFilters: function(filterIds, data) {
    filterIds.forEach(function(filterId){
      var filter = document.getElementById(filterId);
      data.forEach(function(element) {
        filter.options[filter.options.length] = new Option(element,element);
      });
    });
  },
  select2Initialization: function() {
    $('.selectFilter').select2(); //initialize Select 2
    $('#filter1_options').select2();
    $('#filter2_options').select2();
  },
  selectAllSubFilterOptions: function(subFilterId) {
    var subFilter = $('#' + subFilterId);
    subFilter.val(subFilter.data('all-options'));
    subFilter.trigger('change');
  },
  deselectAllSubFilterOptions: function(subFilterId) {
    var subFilter = $('#' + subFilterId);
    subFilter.val('');
    subFilter.trigger('change');
  },
  handleSelectAllCheckAndUncheck: function(checkboxId, subFilterId) {
    $('#' + checkboxId).change(function() {
      if(this.checked){
        BiSquare.FiltersHelper.selectAllSubFilterOptions(subFilterId);
      } else {
        BiSquare.FiltersHelper.deselectAllSubFilterOptions(subFilterId);
      }
    });
  },
  handleFilterChange: function(filterId, subFilterId, checkboxId) {
    $('#' + filterId).change(function() {
      var filterHandler = new FilterHelperHandler(subFilterId, checkboxId);
      filterHandler.fetchSubOptions($(this));
    });
  },
};

var FilterHelperHandler = function(element_id, checkboxId) {
  this.element_id = element_id;
  this.checkboxId = checkboxId;
};

FilterHelperHandler.prototype = {
  handleError: function(response, element){
   alert('Filter Selection is incorrect!');
  },

  fetchSubOptions: function(this_element){
    var that = this;
    $.ajax({
      url: '/filter_sub_options?filter=' + this_element.val(),
      type: "get",
      datatype: "json",
      success: function(response) {
        var filter_options_element = document.getElementById(that.element_id);
         BiSquare.FiltersHelper.clearSelectOptions(filter_options_element);
         var all_options = [];
         response.data.forEach(function(element){
           filter_options_element.options[filter_options_element.options.length] = new Option(element, element);
           all_options.push(element);
         });
         var jquery_elem = $('#' + that.element_id);
         jquery_elem.data('all-options', all_options);
         jquery_elem.prop('disabled', false);
         $('#' + that.checkboxId).prop('disabled', false);
         jquery_elem.select2();
         jquery_elem.trigger('change');
      },//success closing
      error: this.handleError,
    });
  },
};
