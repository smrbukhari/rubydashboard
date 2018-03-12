$(document).on("turbolinks:load", function() {
	$.root_ = $('body');
	/*
	 * GLOBAL: interval array (to be used with jarviswidget in ajax and angular mode) to clear auto fetch interval
	 */
		$.intervalArr = [];
	/*
	 * Calculate nav height
	 */

	/*
	* CUSTOM MENU PLUGIN !!Important Jarvis Method
	*/
		$.fn.extend({

			//pass the options variable to the function
			jarvismenu : function(options) {
				var defaults = {
					accordion : 'true',
					speed : 200,
					closedSign : '[+]',
					openedSign : '[-]'
				},

				// Extend our default options with those provided.
					opts = $.extend(defaults, options),
				//Assign current element to variable, in this case is UL element
					$this = $(this);

				//add a mark [+] to a multilevel menu
				$this.find("li").each(function() {
					if ($(this).find("ul").size() !== 0) {
						//add the multilevel sign next to the link
						$(this).find("a:first").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");

						//avoid jumping to the top of the page when the href is an #
						if ($(this).find("a:first").attr('href') == "#") {
							$(this).find("a:first").click(function() {
								return false;
							});
						}
					}
				});

				//open active level
				$this.find("li.active").each(function() {
					$(this).parents("ul").slideDown(opts.speed);
					$(this).parents("ul").parent("li").find("b:first").html(opts.openedSign);
					$(this).parents("ul").parent("li").addClass("open");
				});

				$this.find("li a").click(function() {

					if ($(this).parent().find("ul").size() !== 0) {

						if (opts.accordion) {
							//Do nothing when the list is open
							if (!$(this).parent().find("ul").is(':visible')) {
								parents = $(this).parent().parents("ul");
								visible = $this.find("ul:visible");
								visible.each(function(visibleIndex) {
									var close = true;
									parents.each(function(parentIndex) {
										if (parents[parentIndex] == visible[visibleIndex]) {
											close = false;
											return false;
										}
									});
									if (close) {
										if ($(this).parent().find("ul") != visible[visibleIndex]) {
											$(visible[visibleIndex]).slideUp(opts.speed, function() {
												$(this).parent("li").find("b:first").html(opts.closedSign);
												$(this).parent("li").removeClass("open");
											});

										}
									}
								});
							}
						}// end if
						if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active")) {
							$(this).parent().find("ul:first").slideUp(opts.speed, function() {
								$(this).parent("li").removeClass("open");
								$(this).parent("li").find("b:first").delay(opts.speed).html(opts.closedSign);
							});

						} else {
							$(this).parent().find("ul:first").slideDown(opts.speed, function() {
								/*$(this).effect("highlight", {color : '#616161'}, 500); - disabled due to CPU clocking on phones*/
								$(this).parent("li").addClass("open");
								$(this).parent("li").find("b:first").delay(opts.speed).html(opts.openedSign);
							});
						} // end else
					} // end if
				});
			} // end function
		});
	/* ~ END: CUSTOM MENU PLUGIN */

	var calc_navbar_height = function() {
			var height = null;

			if ($('#header').length)
				height = $('#header').height();

			if (height === null)
				height = $('<div id="header"></div>').height();

			if (height === null)
				return 49;
			// default
			return height;
		},

		navbar_height = calc_navbar_height,
	/*
	 * APP DOM REFERENCES
	 * Description: Obj DOM reference, please try to avoid changing these
	 */
		shortcut_dropdown = $('#shortcut'),

		bread_crumb = $('#ribbon ol.breadcrumb'),
	/*
	 * Top menu on/off
	 */
		topmenu = false,
	/*
	 * desktop or mobile
	 */
		thisDevice = null,
	/*
	 * DETECT MOBILE DEVICES
	 * Description: Detects mobile device - if any of the listed device is detected
	 * a class is inserted to $.root_ and the variable thisDevice is decleard.
	 * (so far this is covering most hand held devices)
	 */
		ismobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())),
	/*
	 * JS ARRAY SCRIPT STORAGE
	 * Description: used with loadScript to store script path and file name
	 * so it will not load twice
	 */
		jsArray = {},
	/*
	 * App Initialize
	 * Description: Initializes the app with intApp();
	 */
		initApp = (function(app) {

			/*
			 * ADD DEVICE TYPE
			 * Detect if mobile or desktop
			 */
			app.addDeviceType = function() {

				if (!ismobile) {
					// Desktop
					$.root_.addClass("desktop-detected");
					thisDevice = "desktop";
					return false;
				} else {
					// Mobile
					$.root_.addClass("mobile-detected");
					thisDevice = "mobile";

					if (fastClick) {
						// Removes the tap delay in idevices
						// dependency: js/plugin/fastclick/fastclick.js
						$.root_.addClass("needsclick");
						FastClick.attach(document.body);
						return false;
					}

				}

			};
			/* ~ END: ADD DEVICE TYPE */

			/*
			 * CHECK FOR MENU POSITION
			 * Scans localstroage for menu position (vertical or horizontal)
			 */
			app.menuPos = function() {

			 	if ($.root_.hasClass("menu-on-top") || localStorage.getItem('sm-setmenu')=='top' ) {
			 		topmenu = true;
			 		$.root_.addClass("menu-on-top");
			 	}
			};
			/* ~ END: CHECK MOBILE DEVICE */

			/*
			 * SMART ACTIONS
			 */
			app.SmartActions = function(){

				var smartActions = {

				    // LOGOUT MSG
				    userLogout: function($this){

						// ask verification
						$.SmartMessageBox({
							title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
							content : $this.data('logout-msg') || "You can improve your security further after logging out by closing this opened browser",
							buttons : '[No][Yes]'

						}, function(ButtonPressed) {
							if (ButtonPressed == "Yes") {
								$.root_.addClass('animated fadeOutUp');
								setTimeout(logout, 1000);
							}
						});
						function logout() {
							window.location = $this.attr('href');
						}

					},

					// RESET WIDGETS
				    resetWidgets: function($this){
						$.widresetMSG = $this.data('reset-msg');

						$.SmartMessageBox({
							title : "<i class='fa fa-refresh' style='color:green'></i> Clear Local Storage",
							content : $.widresetMSG || "Would you like to RESET all your saved widgets and clear LocalStorage?",
							buttons : '[No][Yes]'
						}, function(ButtonPressed) {
							if (ButtonPressed == "Yes" && localStorage) {
								localStorage.clear();
								location.reload();
							}

						});
				    },

				    // LAUNCH FULLSCREEN
				    launchFullscreen: function(element){

						if (!$.root_.hasClass("full-screen")) {

							$.root_.addClass("full-screen");

							if (element.requestFullscreen) {
								element.requestFullscreen();
							} else if (element.mozRequestFullScreen) {
								element.mozRequestFullScreen();
							} else if (element.webkitRequestFullscreen) {
								element.webkitRequestFullscreen();
							} else if (element.msRequestFullscreen) {
								element.msRequestFullscreen();
							}

						} else {

							$.root_.removeClass("full-screen");

							if (document.exitFullscreen) {
								document.exitFullscreen();
							} else if (document.mozCancelFullScreen) {
								document.mozCancelFullScreen();
							} else if (document.webkitExitFullscreen) {
								document.webkitExitFullscreen();
							}

						}

				   },

				   // MINIFY MENU
				    minifyMenu: function($this){
							console.log('minifyMenu');
				    	if (!$.root_.hasClass("menu-on-top")){
							$.root_.toggleClass("minified");
							$.root_.removeClass("hidden-menu");
							$('html').removeClass("hidden-menu-mobile-lock");
							$this.effect("highlight", {}, 500);
						}
				    },

				    // TOGGLE MENU
				    toggleMenu: function(){
				    	if (!$.root_.hasClass("menu-on-top")){
							$('html').toggleClass("hidden-menu-mobile-lock");
							$.root_.toggleClass("hidden-menu");
							$.root_.removeClass("minified");
				    	} else if ( $.root_.hasClass("menu-on-top") && $.root_.hasClass("mobile-view-activated") ) {
				    		$('html').toggleClass("hidden-menu-mobile-lock");
							$.root_.toggleClass("hidden-menu");
							$.root_.removeClass("minified");
				    	}
				    },

				    // TOGGLE SHORTCUT
				    toggleShortcut: function(){

						if (shortcut_dropdown.is(":visible")) {
							shortcut_buttons_hide();
						} else {
							shortcut_buttons_show();
						}

						// SHORT CUT (buttons that appear when clicked on user name)
						shortcut_dropdown.find('a').click(function(e) {
							e.preventDefault();
							window.location = $(this).attr('href');
							setTimeout(shortcut_buttons_hide, 300);

						});

						// SHORTCUT buttons goes away if mouse is clicked outside of the area
						$(document).mouseup(function(e) {
							if (!shortcut_dropdown.is(e.target) && shortcut_dropdown.has(e.target).length === 0) {
								shortcut_buttons_hide();
							}
						});

						// SHORTCUT ANIMATE HIDE
						function shortcut_buttons_hide() {
							shortcut_dropdown.animate({
								height : "hide"
							}, 300, "easeOutCirc");
							$.root_.removeClass('shortcut-on');

						}

						// SHORTCUT ANIMATE SHOW
						function shortcut_buttons_show() {
							shortcut_dropdown.animate({
								height : "show"
							}, 200, "easeOutCirc");
							$.root_.addClass('shortcut-on');
						}

				    }

				};

				$.root_.on('click', '[data-action="userLogout"]', function(e) {
					var $this = $(this);
					smartActions.userLogout($this);
					e.preventDefault();

					//clear memory reference
					$this = null;

				});

				/*
				 * BUTTON ACTIONS
				 */
				$.root_.on('click', '[data-action="resetWidgets"]', function(e) {
					var $this = $(this);
					smartActions.resetWidgets($this);
					e.preventDefault();

					//clear memory reference
					$this = null;
				});

				$.root_.on('click', '[data-action="launchFullscreen"]', function(e) {
					smartActions.launchFullscreen(document.documentElement);
					e.preventDefault();
				});

				$.root_.on('click', '[data-action="minifyMenu"]', function(e) {
					var $this = $(this);
					smartActions.minifyMenu($this);
					e.preventDefault();

					//clear memory reference
					$this = null;
				});

				$.root_.on('click', '[data-action="toggleMenu"]', function(e) {
					smartActions.toggleMenu();
					e.preventDefault();
				});

				$.root_.on('click', '[data-action="toggleShortcut"]', function(e) {
					smartActions.toggleShortcut();
					e.preventDefault();
				});

			};
			/* ~ END: SMART ACTIONS */

			/*
			 * ACTIVATE NAVIGATION
			 * Description: Activation will fail if top navigation is on
			 */
			app.leftNav = function(){

				// INITIALIZE LEFT NAV
				if (!topmenu) {
					if (!null) {
						$('nav ul').jarvismenu({
							accordion : true,
							speed : menu_speed,
							closedSign : '<em class="fa fa-plus-square-o"></em>',
							openedSign : '<em class="fa fa-minus-square-o"></em>'
						});
					} else {
						alert("Error - menu anchor does not exist");
					}
				}

			};
			/* ~ END: ACTIVATE NAVIGATION */

			/*
			 * MISCELANEOUS DOM READY FUNCTIONS
			 * Description: fire with jQuery(document).ready...
			 */
			app.domReadyMisc = function() {

				/*
				 * FIRE TOOLTIPS
				 */
				if ($("[rel=tooltip]").length) {
					$("[rel=tooltip]").tooltip();
				}

				// SHOW & HIDE MOBILE SEARCH FIELD
				$('#search-mobile').click(function() {
					$.root_.addClass('search-mobile');
				});

				$('#cancel-search-js').click(function() {
					$.root_.removeClass('search-mobile');
				});

				// ACTIVITY
				// ajax drop
				$('#activity').click(function(e) {
					var $this = $(this);

					if ($this.find('.badge').hasClass('bg-color-red')) {
						$this.find('.badge').removeClassPrefix('bg-color-');
						$this.find('.badge').text("0");
						// console.log("Ajax call for activity")
					}

					if (!$this.next('.ajax-dropdown').is(':visible')) {
						$this.next('.ajax-dropdown').fadeIn(150);
						$this.addClass('active');
					} else {
						$this.next('.ajax-dropdown').fadeOut(150);
						$this.removeClass('active');
					}

					var mytest = $this.next('.ajax-dropdown').find('.btn-group > .active > input').attr('id');
					//console.log(mytest)

					//clear memory reference
					$this = null;
					mytest = null;

					e.preventDefault();
				});

				$('input[name="activity"]').change(function() {
					//alert($(this).val())
					var $this = $(this);

					url = $this.attr('id');
					container = $('.ajax-notifications');

					loadURL(url, container);

					//clear memory reference
					$this = null;
				});

				// close dropdown if mouse is not inside the area of .ajax-dropdown
				$(document).mouseup(function(e) {
					if (!$('.ajax-dropdown').is(e.target) && $('.ajax-dropdown').has(e.target).length === 0) {
						$('.ajax-dropdown').fadeOut(150);
						$('.ajax-dropdown').prev().removeClass("active");
					}
				});

				// loading animation (demo purpose only)
				$('button[data-btn-loading]').on('click', function() {
					var btn = $(this);
					btn.button('loading');
					setTimeout(function() {
						btn.button('reset');
					}, 3000);

					//clear memory reference
					$this = null;
				});

				// NOTIFICATION IS PRESENT
				// Change color of lable once notification button is clicked

				$this = $('#activity > .badge');

				if (parseInt($this.text()) > 0) {
					$this.addClass("bg-color-red bounceIn animated");

					//clear memory reference
					$this = null;
				}


			};
			/* ~ END: MISCELANEOUS DOM */

			return app;

		})({});

		initApp.addDeviceType();
		initApp.menuPos();
	/*
	 * DOCUMENT LOADED EVENT
	 * Description: Fire when DOM is ready
	 */
		jQuery(document).ready(function() {

			initApp.SmartActions();
			initApp.leftNav();
			initApp.domReadyMisc();

		});
	/*
	 * RESIZER WITH THROTTLE
	 * Source: http://benalman.com/code/projects/jquery-resize/examples/resize/
	 */
		(function ($, window, undefined) {

		    var elems = $([]),
		        jq_resize = $.resize = $.extend($.resize, {}),
		        timeout_id, str_setTimeout = 'setTimeout',
		        str_resize = 'resize',
		        str_data = str_resize + '-special-event',
		        str_delay = 'delay',
		        str_throttle = 'throttleWindow';

		    jq_resize[str_delay] = throttle_delay;

		    jq_resize[str_throttle] = true;

		    $.event.special[str_resize] = {

		        setup: function () {
		            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
		                return false;
		            }

		            var elem = $(this);
		            elems = elems.add(elem);
		            try {
		                $.data(this, str_data, {
		                    w: elem.width(),
		                    h: elem.height()
		                });
		            } catch (e) {
		                $.data(this, str_data, {
		                    w: elem.width, // elem.width();
		                    h: elem.height // elem.height();
		                });
		            }

		            if (elems.length === 1) {
		                // loopy();
		            }
		        },
		        teardown: function () {
		            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
		                return false;
		            }

		            var elem = $(this);
		            elems = elems.not(elem);
		            elem.removeData(str_data);
		            if (!elems.length) {
		                clearTimeout(timeout_id);
		            }
		        },

		        add: function (handleObj) {
		            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
		                return false;
		            }
		            var old_handler;

		            function new_handler(e, w, h) {
		                var elem = $(this),
		                    data = $.data(this, str_data);
		                data.w = w !== undefined ? w : elem.width();
		                data.h = h !== undefined ? h : elem.height();

		                old_handler.apply(this, arguments);
		            }
		            if ($.isFunction(handleObj)) {
		                old_handler = handleObj;
		                return new_handler;
		            } else {
		                old_handler = handleObj.handler;
		                handleObj.handler = new_handler;
		            }
		        }
		    };

		    // function loopy() {
		    //     timeout_id = window[str_setTimeout](function () {
		    //         elems.each(function () {
		    //             var width;
		    //             var height;
        //
		    //             var elem = $(this),
		    //                 data = $.data(this, str_data); //width = elem.width(), height = elem.height();
        //
		    //             // Highcharts fix
		    //             try {
		    //                 width = elem.width();
		    //             } catch (e) {
		    //                 width = elem.width;
		    //             }
        //
		    //             try {
		    //                 height = elem.height();
		    //             } catch (e) {
		    //                 height = elem.height;
		    //             }
		    //             //fixed bug
        //
        //
		    //             if (width !== data.w || height !== data.h) {
		    //                 elem.trigger(str_resize, [data.w = width, data.h = height]);
		    //             }
        //
		    //         });
		    //         // loopy();
        //
		    //     }, jq_resize[str_delay]);
        //
		    // }

		})(jQuery, this);
	/*
	* ADD CLASS WHEN BELOW CERTAIN WIDTH (MOBILE MENU)
	* Description: changes the page min-width of #CONTENT and NAV when navigation is resized.
	* This is to counter bugs for minimum page width on many desktop and mobile devices.
	* Note: This script uses JSthrottle technique so don't worry about memory/CPU usage
	*/
		$('#main').resize(function() {

			if ($(window).width() < 979) {
				$.root_.addClass('mobile-view-activated');
				$.root_.removeClass('minified');
			} else if ($.root_.hasClass('mobile-view-activated')) {
				$.root_.removeClass('mobile-view-activated');
			}

		});
	/* ~ END: NAV OR #LEFT-BAR RESIZE DETECT */

	/*
	 * DETECT IE VERSION
	 * Description: A short snippet for detecting versions of IE in JavaScript
	 * without resorting to user-agent sniffing
	 * RETURNS:
	 * If you're not in IE (or IE version is less than 5) then:
	 * //ie === undefined
	 *
	 * If you're in IE (>=5) then you can determine which version:
	 * // ie === 7; // IE7
	 *
	 * Thus, to detect IE:
	 * // if (ie) {}
	 *
	 * And to detect the version:
	 * ie === 6 // IE6
	 * ie > 7 // IE8, IE9 ...
	 * ie < 9 // Anything less than IE9
	 */
	// TODO: delete this function later on - no longer needed (?)
		var ie = ( function() {

			var undef, v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');

			while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);

			return v > 4 ? v : undef;

		}());
	/* ~ END: DETECT IE VERSION */


	/*
	 * ELEMENT EXIST OR NOT
	 * Description: returns true or false
	 * Usage: $('#myDiv').doesExist();
	 */
		jQuery.fn.doesExist = function() {
			return jQuery(this).length > 0;
		};
	/* ~ END: ELEMENT EXIST OR NOT */

	/*
	 * INITIALIZE FORMS
	 * Description: Select2, Masking, Datepicker, Autocomplete
	 */
		function runAllForms() {

			/*
			 * BOOTSTRAP SLIDER PLUGIN
			 * Usage:
			 * Dependency: js/plugin/bootstrap-slider
			 */
			if ($.fn.slider) {
				$('.slider').slider();
			}

			/*
			 * SELECT2 PLUGIN
			 * Usage:
			 * Dependency: js/plugin/select2/
			 */
			if ($.fn.select2) {
				$('.select2').each(function() {
					var $this = $(this),
						width = $this.attr('data-select-width') || '100%';
					//, _showSearchInput = $this.attr('data-select-search') === 'true';
					$this.select2({
						//showSearchInput : _showSearchInput,
						allowClear : true,
						width : width
					});

					//clear memory reference
					$this = null;
				});
			}

			/*
			 * MASKING
			 * Dependency: js/plugin/masked-input/
			 */
			if ($.fn.mask) {
				$('[data-mask]').each(function() {

					var $this = $(this),
						mask = $this.attr('data-mask') || 'error...', mask_placeholder = $this.attr('data-mask-placeholder') || 'X';

					$this.mask(mask, {
						placeholder : mask_placeholder
					});

					//clear memory reference
					$this = null;
				});
			}

			/*
			 * AUTOCOMPLETE
			 * Dependency: js/jqui
			 */
			if ($.fn.autocomplete) {
				$('[data-autocomplete]').each(function() {

					var $this = $(this),
						availableTags = $this.data('autocomplete') || ["The", "Quick", "Brown", "Fox", "Jumps", "Over", "Three", "Lazy", "Dogs"];

					$this.autocomplete({
						source : availableTags
					});

					//clear memory reference
					$this = null;
				});
			}

			/*
			 * JQUERY UI DATE
			 * Dependency: js/libs/jquery-ui-1.10.3.min.js
			 * Usage: <input class="datepicker" />
			 */
			if ($.fn.datepicker) {
				$('.datepicker').each(function() {

					var $this = $(this),
						dataDateFormat = $this.attr('data-dateformat') || 'dd.mm.yy';

					$this.datepicker({
						dateFormat : dataDateFormat,
						prevText : '<i class="fa fa-chevron-left"></i>',
						nextText : '<i class="fa fa-chevron-right"></i>',
					});

					//clear memory reference
					$this = null;
				});
			}

			/*
			 * AJAX BUTTON LOADING TEXT
			 * Usage: <button type="button" data-loading-text="Loading..." class="btn btn-xs btn-default ajax-refresh"> .. </button>
			 */
			$('button[data-loading-text]').on('click', function() {
				var btn = $(this);
				btn.button('loading');
				setTimeout(function() {
					btn.button('reset');
				}, 3000);

				//clear memory reference
				btn = null;
			});

		}
	/* ~ END: INITIALIZE FORMS */

	/*
	 * INITIALIZE JARVIS WIDGETS
	 * Setup Desktop Widgets
	 */
		function setup_widgets_desktop() {

			if ($.fn.jarvisWidgets && enableJarvisWidgets) {

				$('#widget-grid').jarvisWidgets({

					grid : 'article',
					widgets : '.jarviswidget',
					localStorage : true,
					deleteSettingsKey : '#deletesettingskey-options',
					settingsKeyLabel : 'Reset settings?',
					deletePositionKey : '#deletepositionkey-options',
					positionKeyLabel : 'Reset position?',
					sortable : true,
					buttonsHidden : false,
					// toggle button
					toggleButton : true,
					toggleClass : 'fa fa-minus | fa fa-plus',
					toggleSpeed : 200,
					onToggle : function() {
					},
					// delete btn
					deleteButton : true,
					deleteClass : 'fa fa-times',
					deleteSpeed : 200,
					onDelete : function() {
					},
					// edit btn
					editButton : true,
					editPlaceholder : '.jarviswidget-editbox',
					editClass : 'fa fa-cog | fa fa-save',
					editSpeed : 200,
					onEdit : function() {
					},
					// color button
					colorButton : true,
					// full screen
					fullscreenButton : true,
					fullscreenClass : 'fa fa-expand | fa fa-compress',
					fullscreenDiff : 3,
					onFullscreen : function() {
					},
					// custom btn
					customButton : false,
					customClass : 'folder-10 | next-10',
					customStart : function() {
						alert('Hello you, this is a custom button...');
					},
					customEnd : function() {
						alert('bye, till next time...');
					},
					// order
					buttonOrder : '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
					opacity : 1.0,
					dragHandle : '> header',
					placeholderClass : 'jarviswidget-placeholder',
					indicator : true,
					indicatorTime : 600,
					ajax : true,
					timestampPlaceholder : '.jarviswidget-timestamp',
					timestampFormat : 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
					refreshButton : true,
					refreshButtonClass : 'fa fa-refresh',
					labelError : 'Sorry but there was a error:',
					labelUpdated : 'Last Update:',
					labelRefresh : 'Refresh',
					labelDelete : 'Delete widget:',
					afterLoad : function() {
					},
					rtl : false, // best not to toggle this!
					onChange : function() {

					},
					onSave : function() {

					},
					ajaxnav : $.navAsAjax // declears how the localstorage should be saved (HTML or AJAX page)

				});

			}

		}
	/*
	 * SETUP DESKTOP WIDGET
	 */
		function setup_widgets_mobile() {

			if (enableMobileWidgets && enableJarvisWidgets) {
				setup_widgets_desktop();
			}

		}

	/*
	 * LOAD SCRIPTS
	 * Usage:
	 * Define function = myPrettyCode ()...
	 * loadScript("js/my_lovely_script.js", myPrettyCode);
	 */
		function loadScript(scriptName, callback) {

			if (!jsArray[scriptName]) {
				jsArray[scriptName] = true;

				// adding the script tag to the head as suggested before
				var body = document.getElementsByTagName('body')[0],
					script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = scriptName;

				// then bind the event to the callback function
				// there are several events for cross browser compatibility
				script.onload = callback;

				// fire the loading
				body.appendChild(script);

				// clear DOM reference
				//body = null;
				//script = null;

			} else if (callback) {
				// changed else to else if(callback)
				//console.log("JS file already added!");
				//execute function
				callback();
			}

		}
	/* ~ END: LOAD SCRIPTS */

	/*
	* APP AJAX REQUEST SETUP
	* Description: Executes and fetches all ajax requests also
	* updates naivgation elements to active
	*/
	//Sarmad Script Start
	// remove all active class
	$('nav li.active').removeClass("active");
	// match the url and add the active class
	$('nav li:has(a[href="' + window.location.pathname + '"])').addClass("active");
	var title = ($('nav a[href="' + window.location.pathname + '"]').attr('title'));
	$("li.active").first().find("ul").slideDown();
	if($("li.active").first().find("ul").size() !== 0){
		$("li.active").first().removeClass("active");
	}
	// Sarmad Script End
		if($.navAsAjax) {
		    // fire this on page load if nav exists
		    if ($('nav').length) {
			    checkURL();
		    }

		    $(document).on('click', 'nav a[href!="#"]', function(e) {
			    e.preventDefault();
			    var $this = $(e.currentTarget);

			    // if parent is not active then get hash, or else page is assumed to be loaded
				if (!$this.parent().hasClass("active") && !$this.attr('target')) {

				    // update window with hash
				    // you could also do here:  thisDevice === "mobile" - and save a little more memory

				    if ($.root_.hasClass('mobile-view-activated')) {
					    $.root_.removeClass('hidden-menu');
					    $('html').removeClass("hidden-menu-mobile-lock");
					    window.setTimeout(function() {
							if (window.location.search) {
								window.location.href =
									window.location.href.replace(window.location.search, '')
										.replace(window.location.hash, '') + '#' + $this.attr('href');
							} else {
								window.location.hash = $this.attr('href');
							}
					    }, 150);
					    // it may not need this delay...
				    } else {
						if (window.location.search) {
							window.location.href =
								window.location.href.replace(window.location.search, '')
									.replace(window.location.hash, '') + '#' + $this.attr('href');
						} else {
							window.location.hash = $this.attr('href');
						}
				    }

				    // clear DOM reference
				    // $this = null;
			    }

		    });

		    // fire links with targets on different window
		    $(document).on('click', 'nav a[target="_blank"]', function(e) {
			    e.preventDefault();
			    var $this = $(e.currentTarget);

			    window.open($this.attr('href'));
		    });

		    // fire links with targets on same window
		    $(document).on('click', 'nav a[target="_top"]', function(e) {
			    e.preventDefault();
			    var $this = $(e.currentTarget);

			    window.location = ($this.attr('href'));
		    });

		    // all links with hash tags are ignored
		    $(document).on('click', 'nav a[href="#"]', function(e) {
			    e.preventDefault();
		    });

		    // DO on hash change
		    $(window).on('hashchange', function() {
			    checkURL();
		    });
		}
	/*
	 * CHECK TO SEE IF URL EXISTS
	 */
		function checkURL() {

			//get the url by removing the hash
			//var url = location.hash.replace(/^#/, '');
			var url = location.href.split('#').splice(1).join('#');
			//BEGIN: IE11 Work Around
			if (!url) {

				try {
					var documentUrl = window.document.URL;
					if (documentUrl) {
						if (documentUrl.indexOf('#', 0) > 0 && documentUrl.indexOf('#', 0) < (documentUrl.length + 1)) {
							url = documentUrl.substring(documentUrl.indexOf('#', 0) + 1);

						}

					}

				} catch (err) {}
			}
			//END: IE11 Work Around

			container = $('#content');
			// Do this if url exists (for page refresh, etc...)
			if (url) {
				// remove all active class
				$('nav li.active').removeClass("active");
				// match the url and add the active class
				$('nav li:has(a[href="' + url + '"])').addClass("active");
				var title = ($('nav a[href="' + url + '"]').attr('title'));

				// change page title from global var
				document.title = (title || document.title);
				//console.log("page title: " + document.title);

				// parse url to jquery
				loadURL(url + location.search, container);

			} else {

				// grab the first URL from nav
				var $this = $('nav > ul > li:first-child > a[href!="#"]');

				//update hash
				window.location.hash = $this.attr('href');

				//clear dom reference
				$this = null;

			}

		}
	/*
	 * LOAD AJAX PAGES
	 */
		function loadURL(url, container) {
			//console.log(container)

			$.ajax({
				type : "GET",
				url : url,
				dataType : 'html',
				cache : true, // (warning: setting it to false will cause a timestamp and will call the request twice)
				beforeSend : function() {

					//IE11 bug fix for googlemaps (delete all google map instances)
					//check if the page is ajax = true, has google map class and the container is #content
					if ($.navAsAjax && $(".google_maps")[0] && (container[0] == $("#content")[0]) ) {

						// target gmaps if any on page
						var collection = $(".google_maps"),
							i = 0;
						// run for each	map
						collection.each(function() {
						    i ++;
						    // get map id from class elements
						    var divDealerMap = document.getElementById(this.id);

						    if(i == collection.length + 1) {
							    // "callback"
							    //console.log("all maps destroyed");
							} else {
								// destroy every map found
								if (divDealerMap) divDealerMap.parentNode.removeChild(divDealerMap);
								//console.log(this.id + " destroying maps...");
							}
						});

						//console.log("google maps nuked!!!");

					} //end fix

					// destroy all datatable instances
					if ( $.navAsAjax && $('.dataTables_wrapper')[0] && (container[0] == $("#content")[0]) ) {

						var tables = $.fn.dataTable.fnTables(true);
						$(tables).each(function () {
						    $(this).dataTable().fnDestroy();
						});
						//console.log("datatable nuked!!!");
					}
					// end destroy

					// pop intervals (destroys jarviswidget related intervals)
					if ( $.navAsAjax && $.intervalArr.length > 0 && (container[0] == $("#content")[0]) && enableJarvisWidgets ) {

						while($.intervalArr.length > 0)
		        			clearInterval($.intervalArr.pop());
		        			//console.log("all intervals cleared..")

					}
					// end pop intervals

					// empty container and var to start garbage collection (frees memory)
					pagefunction = null;
					container.removeData().html("");

					// place cog
					container.html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> Loading...</h1>');

					// Only draw breadcrumb if it is main content material
					if (container[0] == $("#content")[0]) {

						// clear everything else except these key DOM elements
						// we do this because sometime plugins will leave dynamic elements behind
						$('body').find('> *').filter(':not(' + ignore_key_elms + ')').empty().remove();

						// draw breadcrumb
						drawBreadCrumb();

						// scroll up
						$("html").animate({
							scrollTop : 0
						}, "fast");
					}
					// end if
				},
				success : function(data) {

					// dump data to container
					container.css({
						opacity : '0.0'
					}).html(data).delay(50).animate({
						opacity : '1.0'
					}, 300);

					// clear data var
					data = null;
					container = null;
				},
				error : function(xhr, ajaxOptions, thrownError) {
					container.html('<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error 404! Page not found.</h4>');
				},
				async : true
			});

			//console.log("ajax request sent");
		}
	/*
	 * UPDATE BREADCRUMB
	 */
		function drawBreadCrumb() {
			var nav_elems = $('nav li.active > a'),
				count = nav_elems.length;

			//console.log("breadcrumb")
			bread_crumb.empty();
			bread_crumb.append($("<li>Home</li>"));
			nav_elems.each(function() {
				bread_crumb.append($("<li></li>").html($.trim($(this).clone().children(".badge").remove().end().text())));
				// update title when breadcrumb is finished...
				if (!--count) document.title = bread_crumb.find("li:last-child").text();
				//nav_elems = null;
			});

			// clear dom reference
			nav_elems = null;

		}
	/* ~ END: APP AJAX REQUEST SETUP */

	/*
	 * PAGE SETUP
	 * Description: fire certain scripts that run through the page
	 * to check for form elements, tooltip activation, popovers, etc...
	 */
		function pageSetUp() {
			if (thisDevice === "desktop"){
				// is desktop

				// activate tooltips
				$("[rel=tooltip]").tooltip();

				// activate popovers
				$("[rel=popover]").popover();

				// activate popovers with hover states
				$("[rel=popover-hover]").popover({
					trigger : "hover"
				});

				// setup widgets
				setup_widgets_desktop();


				// run form elements
				runAllForms();

			} else {

				// is mobile

				// activate popovers
				$("[rel=popover]").popover();

				// activate popovers with hover states
				$("[rel=popover-hover]").popover({
					trigger : "hover"
				});

				// setup widgets
				setup_widgets_mobile();

				// run form elements
				runAllForms();

			}

		}
	/*
	 * 1 POP OVER THEORY
	 * Keep only 1 active popover per trigger - also check and hide active popover if user clicks on document
	 */
		$('body').on('click', function(e) {
			$('[rel="popover"]').each(function() {
				//the 'is' for buttons that trigger popups
				//the 'has' for icons within a button that triggers a popup
				if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
					$(this).popover('hide');
				}
			});
		});

		pageSetUp();

});
