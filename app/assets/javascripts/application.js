//= require BiSquare
//= require jquery
//= require loadingoverlay.min.js
//= require loadingoverlay_progress.min.js
//= require jquery_ujs
//= require turbolinks
//= require bootstrap-sprockets
//= require app.config.js
//= require app.js
$(document).on("turbolinks:load", function() {
  console.log('tl load');
  // DO NOT REMOVE : GLOBAL FUNCTIONS!
  pageSetUp();
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
