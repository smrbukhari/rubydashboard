// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require loadingoverlay.min.js
//= require loadingoverlay_progress.min.js
//= require jquery_ujs
//= require turbolinks
//= require Chart.bundle
//= require chartkick
//= require bootstrap-sprockets
//= require_tree .

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