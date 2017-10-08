var FiltersHelper = {
  clearSelectOptions: function(element){
    var element_len = element.options.length;
    for (var i=0; i<element_len; i++){
      element.options.remove(0);
    }
  }
}
