var FiltersHelper = {
  clearSelectOptions: function(element){
    var element_len = element.options.length;
    for (var i=0; i<element_len; i++){
      element.options.remove(0);
    }
  },
};

var FilterHelperHandler = function(element_id) {
  this.element_id = element_id;
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
         FiltersHelper.clearSelectOptions(filter_options_element);
         var all_options = [];
         response.data.forEach(function(element){
           filter_options_element.options[filter_options_element.options.length] = new Option(element, element);
           all_options.push(element);
         });
         var jquery_elem = $('#' + that.element_id);
         jquery_elem.data('all-options', all_options);
         jquery_elem.prop('disabled', false);
         jquery_elem.select2();
         jquery_elem.trigger('change');
      },//success closing
      error: this.handleError,
    });
  },
};
