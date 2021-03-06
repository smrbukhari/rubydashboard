//= require BiSquare
//= require jquery
//= require jquery-ui-1.10.3.min.js
//= require loadingoverlay.min.js
//= require loadingoverlay_progress.min.js
//= require jquery_ujs
//= require turbolinks
//= require bootstrap-sprockets
//= require jarvis.widget.js
//= require app.config.js
//= require app.js
$(document).on("turbolinks:load", function() {
  // DO NOT REMOVE : GLOBAL FUNCTIONS!
});

// Hide/Show Loader on Ajax Calls
$(document).ajaxStart(function() {
  // Set window.pauseLoadingOverlay to true if you do not want LoadingOverlay to get triggered on specific XHR request
  // Then on your ajax complete callback reset it to false
  if(!window.pauseLoadingOverlay) {
    $.LoadingOverlay("show");
  }
});

$(document).ajaxStop(function() {
  $.LoadingOverlay("hide");
});
