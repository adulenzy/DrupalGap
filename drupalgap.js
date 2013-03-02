var drupalgap = {
  'modules':{
	  'core':[
	     {'name':'api'},
	     {'name':'comment'},
	     {'name':'dashboard'},
	     {'name':'entity'},
	     {'name':'field'},
	     {'name':'form'},
	     {'name':'node'},
	     {'name':'services',
	       'includes':[
		       {'name':'comment'},
		       {'name':'drupalgap_content'},
		       {'name':'drupalgap_system'},
		       {'name':'drupalgap_taxonomy'},
		       {'name':'drupalgap_user'},
		       {'name':'file'},
		       {'name':'node'},
		       {'name':'services'},
		       {'name':'system'},
		       {'name':'taxonomy_term'},
		       {'name':'taxonomy_vocabulary'},
		       {'name':'user'},
	       ]
	     },
	     {'name':'taxonomy'},
	     {'name':'user'},
	     {'name':'views_datasource'},
	   ]
  },
  'module_paths':[],
  'includes':[
      {'name':'common'},
      {'name':'theme'},
  ],
  'user':{
	  'uid':0, /* do not change this user id value */
	  'name':'Anonymous', /* TODO - this value should come from the drupal site */
  },
  'online':false,
  'destination':'',
  'account':{ }, /* <!-- account --> */
  'account_edit':{ }, /* <!-- account_edit --> */
  'api':{}, // <!-- api -->
  'comment':{ }, /* <!-- comment --> */
  'comment_edit':{ }, /* <!-- comment_edit --> */
  'entity_info':{ }, /* <!-- entity_info --> */
  'field_info_fields':{ }, /* <!-- field_info_fields --> */
  'field_info_instances':{ }, /* <!-- field_info_instances --> */
  'form':{ }, /* <!-- form --> */
  'form_state':{ }, /* <!-- form_state --> */
  'form_errors':{ }, /* <!-- form_errors --> */
  'node':{ }, /* <!-- node --> */
  'node_edit':{ }, /* <!-- node_edit --> */
  'menu_links':{}, /* <!-- menu_links --> */
  'page':{'variables':{}}, /* <!-- page --> */
  'path':'', /* The current menu path. */
  'services':{}, // <!-- services -->
  'taxonomy_term':{ }, /* <!-- taxonomy_term -> */
  'taxonomy_term_edit':{ }, /* <!-- taxonomy_term_edit -> */
  'taxonomy_vocabulary':{ }, /* <!-- taxonomy_vocabulary -> */
  'taxonomy_vocabulary_edit':{ }, /* <!-- taxonomy_vocabulary_edit -> */
  'views_datasource':{}, // <!-- views_datasource -->
}; // <!-- drupalgap -->

function drupalgap_add_js() {
	var data;
	if (arguments[0]) { data = arguments[0]; }
	jQuery.ajax({
    async:false,
    type:'GET',
    url:data,
    data:null,
    success:function(){
      if (drupalgap.settings.debug) {
        // Print the js path to the console.
        console.log(data);
      }
    },
    dataType:'script',
    error: function(xhr, textStatus, errorThrown) {
      console.log('drupalgap_add_js - error');
      console.log(JSON.stringify(xhr));
      alert('drupalgap_add_js - error - (' + data + ' : ' + textStatus + ') ' + errorThrown);
    }
	});
}

/**
 * Takes option set 2, grabs the success/error callback(s), if any, 
 * and appends them onto option set 1's callback(s), then returns
 * the newly assembled option set.
 */
function drupalgap_chain_callbacks(options_set_1, options_set_2) {
	
	//console.log(JSON.stringify(options_set_1));
	//console.log(JSON.stringify(options_set_2));
	
	// Setup the new options.
	var new_options_set = {};
	$.extend(true, new_options_set, options_set_1);
	
	// Chain the success callbacks.
	if (options_set_2.success) {
		if (new_options_set.success) {
			if (!$.isArray(new_options_set.success)) {
				var backup = new_options_set.success;
				new_options_set.success = [];
				new_options_set.success.push(backup);
			}
			new_options_set.success.push(options_set_2.success);
		}
		else {
			new_options_set.success = options_set_2.success; 
		}
	}
	
	// Chain the error callbacks.
	if (options_set_2.error) {
		if (new_options_set.error) {
			if (!$.isArray(new_options_set.error)) {	
				var backup = new_options_set.error;
				new_options_set.error = [];
				new_options_set.error.push(backup);
			}
			new_options_set.error.push(options_set_2.error);
		}
		else {
			new_options_set.error = options_set_2.error; 
		}
	}
	
	// For all other variables in option set 2, add them to the new option set.
	$.each(options_set_2, function(index, object){
		if (index != 'success' && index != 'error') {
			new_options_set[index] = object;
		}
	});
	
	// Return the new option set.
	//console.log(JSON.stringify(new_options_set));
	return new_options_set;
}

/**
 *
 */
function drupalgap_changePage(path) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_changePage()');
      console.log(JSON.stringify(arguments));
    }
  }
  catch (error) {
    alert('drupalgap_changePage - ' + error);
  }
  /*try {
    if (device.platform != 'Android') {
      alert('drupalgap_changePage - device platform not supported yet - ' + device.platform);
    }
    else {
      $.mobile.changePage('file:///android_asset/www/' + path);
    }
  }
  catch (error) {
    alert('drupalgap_changePage - ' + error);
  }*/
}

/**
 * Checks the devices connection and sets drupalgap.online to true if the
 * device has a connection, false otherwise.
 * @returns A string indicating the type of connection according to PhoneGap.
 */
function drupalgap_check_connection() {
    // TODO - Uncomment and use this line once cordova 2.3 is released
    // instead of the navigator.network.connection.type variable.
    //var networkState = navigator.connection.type;
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';
    
    if (states[networkState] == 'No network connection') {
    	drupalgap.online = false;
    }
    else {
    	drupalgap.online = true;
    }

    return states[networkState];
}

/**
 * Implements PhoneGap's deviceready().
 */
function drupalgap_deviceready() {
  // PhoneGap is loaded and it is now safe for DrupalGap to start...
  // Load up settings.
  drupalgap_settings_load();
  // Load up includes.
  drupalgap_includes_load();
	// Load up modules.
	drupalgap_modules_load();
	// Initialize entities.
	//drupalgap_entity_get_info();
	// Initialize menu links.
	drupalgap_menu_links_load();
	// Verify site path is set.
	if (!drupalgap.settings.site_path || drupalgap.settings.site_path == '') {
		navigator.notification.alert(
		    'No site path to Drupal set in the DrupalGap/app/settings.js file!',
		    function(){},
		    'Error',
		    'OK'
		);
		return false;
	}
	// Check device connection.
	drupalgap_check_connection();
	if (!drupalgap.online) {
		drupalgap_module_invoke_all('device_offine');
		// Device is off-line.
		navigator.notification.alert(
		    'No connection found!',
		    function(){ $.mobile.changePage(drupalgap.settings.offline); },
		    'Offline',
		    'OK'
		);
		return false;
	}
	else {
		// Implementations of hook_device_online().
		drupalgap_module_invoke_all('device_online');
		
		if (drupalgap_module_invoke_continue) {
			
			// Device is online, let's make a call to the
			// DrupalGap System Connect Service Resource.
			drupalgap.services.drupalgap_system.connect.call({
				'success':function(result){
				  // Call all hook_device_connected implementations.
					drupalgap_module_invoke_all('device_connected');
					//var promise = $.mobile.loadPage("DrupalGap/themes/easystreet/page.html");
					//var promise = $.mobile.loadPage("themes/easystreet/page.html"); 
					//console.log(JSON.stringify(promise));
					// Set the current menu path to the front page.
					drupalgap.path = drupalgap.settings.front;
					// Change the page to the theme's page.html.
					$.mobile.changePage("DrupalGap/themes/easystreet/page.html");
					/*$.get('DrupalGap/themes/easystreet/page.html', function(data) {
					    console.log(data);
					    //$('body').html(data);
          }, 'html');*/
					// Go to the pront page.
					//$.mobile.changePage(drupalgap.settings.front);
				},
				'error':function(jqXHR, textStatus, errorThrown) {
					if (errorThrown == 'Not Found') {
						navigator.notification.alert(
						    'Review DrupalGap Troubleshooting Topics!',
						    function(){},
						    'Unable to Connect to Drupal',
						    'OK'
						);
					}
				}
			});
			
		}
	}
}

/**
 * 
 * @param count
 * @param singular
 * @param plural
 * @returns
 */
function drupalgap_format_plural(count, singular, plural) {
  try {
    if (count == 1) {
      return singular;
    }
    return plural;
	}
	catch (error) {
	  alert('drupalgap_format_plural - ' + error);
	}
	return null;
}

/**
 * 
 * @param type
 * @param name
 */
function drupalgap_get_path(type, name) {
  try {
    var path = '';
    var found_it = false;
    if (type == 'module') {
      $.each(drupalgap.modules, function(bundle, modules){
        $.each(modules, function(index, module){
          if (name == module.name) {
            path = drupalgap_modules_get_bundle_directory(bundle) + '/';
            path += module.name;
            found_it = true;
          }
          if (found_it) {
            return false;
          }
        });
        if (found_it) {
          return false;
        }
      });
    }
    return path;
  }
  catch (error) {
    alert('drupalgap_get_path - ' + error);
  }
	return null;
}

/**
 * DrupalGap's version of Drupal's drupal_get_title function.
 */
function drupalgap_get_title() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_get_title()');
      console.log(JSON.stringify(arguments));
    }
    // TODO - This should default to the actual Drupal site title.
    return 'DrupalGap';
  }
  catch (error) {
    alert('drupalgap_get_title - ' + error);
  }
}


function drupalgap_goto(path) {
  try {
    if (path && drupalgap.menu_links[path]) {
      var menu_link = drupalgap.menu_links[path];
      var page_callback = menu_link['page callback']
      if (eval('typeof ' + page_callback) == 'function') {
        var fn = window[page_callback];
        fn();
      }
    }
  }
  catch (error) {
    alert('drupalgap_goto - ' + error);
  }
}

/**
 * 
 * @param uri
 * @returns
 */
function drupalgap_image_path(uri) {
	try {
		var src = drupalgap.settings.site_path + drupalgap.settings.base_path + uri;
		if (src.indexOf('public://') != -1) {
			var src = src.replace('public://', drupalgap.settings.file_public_path + '/');
		}
		return src;
	}
	catch (error) {
		alert('drupalgap_image_path - ' + error);
	}
	return null;
}

/**
 * Loads the js files in DrupalGap/includes specified by drupalgap.includes.
 */
function drupalgap_includes_load() {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_includes_load()');
      console.log(JSON.stringify(drupalgap.includes));
    }
    if (drupalgap.includes != null && drupalgap.includes.length != 0) {
      $.each(drupalgap.includes, function(index, include){
          var include_path =  'DrupalGap/includes/' + include.name + '.inc.js';
          jQuery.ajax({
              async:false,
              type:'GET',
              url:include_path,
              data:null,
              success:function(){
                if (drupalgap.settings.debug) {
                  // Print the include path to the console.
                  console.log(include_path.replace('DrupalGap/', ''));
                }
              },
              dataType:'script',
              error: function(xhr, textStatus, errorThrown) {
                  // Look at the `textStatus` and/or `errorThrown` properties.
              }
          });
      });
    }
  }
  catch (error) {
    alert('drupalgap_includes_load - ' + error);
  }
}

/**
 *
 */
function drupalgap_menu_links_load() {
  drupalgap_module_invoke_all('menu');
  var menu_links = drupalgap_module_invoke_results;
  if (menu_links && menu_links.length != 0) {
    $.each(menu_links, function(index, menu_link){
        for (var item in menu_link) {
          drupalgap.menu_links[item] = menu_link[item];
          break;
        }
    })
  }
  if (drupalgap.settings.debug) {
    console.log(JSON.stringify(drupalgap.menu_links));
  }
}

/**
 * Given a module name and a hook name, this will invoke that module's hook.
 */
function drupalgap_module_invoke(module, hook) {
  try {
    var module_arguments = Array.prototype.slice.call(arguments);
    if (drupalgap.modules[module]) {
      function_name = drupalgap.modules[module].name + '_' + hook;
      if (eval('typeof ' + function_name) == 'function') {
        // Get the hook function.
        var fn = window[function_name];
        // Remove the hook from the arguments.
        module_arguments.splice(0,1);
        // If there are no arguments, just call the hook directly, otherwise
        // call the hook and pass along all the arguments.
        if ($.isEmptyObject(module_arguments) ) { fn(); }
        else { fn.apply(null, module_arguments); }
      }
    }
  }
  catch (error) {
    alert('drupalgap_module_invoke - ' + error);
  }
}

var drupalgap_module_invoke_results = null;
var drupalgap_module_invoke_continue = null;
/**
 * 
 * @param hook
 */
function drupalgap_module_invoke_all(hook) {
  try {
    // TODO - shouldn't this function ust iterate over each and then call
    // drupalgap_module_invoke for each?
    
    // Prepare the invocation results.
    drupalgap_module_invoke_results = new Array();
    // Copy the arguments.
    var module_arguments = Array.prototype.slice.call(arguments);
    drupalgap_module_invoke_continue = true;
    // Try to fire the hook in every module.
    $.each(drupalgap.modules, function(bundle, modules){
      $.each(modules, function(index, module){
        function_name = module.name + '_' + hook;
        if (eval('typeof ' + function_name) == 'function') {
            if (drupalgap.settings.debug) {
              console.log('hook(): ' + function_name);
            }
            // Get the hook function.
            var fn = window[function_name];
            // Remove the hook from the arguments.
            module_arguments.splice(0,1);
            // If there are no arguments, just call the hook directly, otherwise
            // call the hook and pass along all the arguments.
            if ($.isEmptyObject(module_arguments) ) {
              drupalgap_module_invoke_results.push(fn());
            }
            else {
              drupalgap_module_invoke_results.push(fn.apply(null, module_arguments));
            }
        }
        // Try to fire the hook in any includes for this module.
        // TODO - hooks defined in module includes won't work properly until
        // each module has a unique name, just like in Drupal. E.g. the user.js
        // module in services collides with the user.js module, therefore both
        // can't implement hook_form_alter().
        /*if (module.includes != null && module.includes.length != 0) {
          $.each(module.includes, function(include_index, include_object){
            function_name = include_object.name + '_' + hook;
            if (eval('typeof ' + function_name) == 'function') {
                  if (drupalgap.settings.debug) {
                    console.log('hook(): ' + function_name);
                  }
                  // Get the hook function.
                  var fn = window[function_name];
                  // Remove the hook from the arguments.
                  module_arguments.splice(0,1);
                  if (drupalgap.settings.debug) {
                    console.log(JSON.stringify(module_arguments));
                  }
                  // If there are no arguments, just call the hook directly, otherwise
                  // call the hook and pass along all the arguments.
                  if ($.isEmptyObject(module_arguments) ) { fn(); }
                  else { fn.apply(null, module_arguments); }
              }
          });
        }*/
      });
    });
  }
  catch (error) {
    alert('drupalgap_module_invoke_all - ' + error);
  }
}

/**
 *
 */
function drupalgap_modules_get_bundle_directory(bundle) {
  try {
    dir = '';
    if (bundle == 'core') { dir = 'DrupalGap/modules'; }
    else if (bundle == 'contrib') { dir = 'DrupalGap/app/modules'; }
    else if (bundle == 'custom') { dir = 'DrupalGap/app/modules/custom'; }
    return dir;
  }
  catch (error) {
    alert('drupalgap_modules_get_bundle_directory - ' + error);
  }
  return '';
}

/**
 * 
 */
function drupalgap_modules_load() {
	if (drupalgap.modules != null && drupalgap.modules.length != 0) {
		$.each(drupalgap.modules, function(bundle, modules){
			$.each(modules, function(index, module){
				// Determine module directory.
				dir = drupalgap_modules_get_bundle_directory(bundle);
				module_base_path = dir + '/' + module.name;
				// Add module .js file to array of paths to load.
				module_path =  module_base_path + '/' + module.name + '.js';
				modules_paths = [module_path];
				// If there are any includes with this module, add them to the list of
				// paths to include.
				if (module.includes != null && module.includes.length != 0) {
					$.each(module.includes, function(include_index, include_object){
						modules_paths.push(module_base_path + '/' + include_object.name + '.js');
					});
				}
				// Now load all the paths for this module.
				$.each(modules_paths, function(modules_paths_index, modules_paths_object){
					jQuery.ajax({
					    async:false,
					    type:'GET',
					    url:modules_paths_object,
					    data:null,
					    success:function(){
					    	if (drupalgap.settings.debug) {
					    		// Print the module path to the console.
					    		console.log(modules_paths_object.replace('DrupalGap/', ''));
					    	}
					    },
					    dataType:'script',
					    error: function(xhr, textStatus, errorThrown) {
					        // Look at the `textStatus` and/or `errorThrown` properties.
					    }
					});
				});
			});
		});
	}
}

/**
 * Given a DrupalGap path, this returns the equivalent HTTP status code for the
 * page in the app. 200, 404, etc.
 */
function drupalgap_page_http_status_code(path) {
  try {
    var status_code = null;
    if (drupalgap.settings.debug) {
      console.log('drupalgap_page_http_status_code()');
      console.log(JSON.stringify(arguments));
    }
    // Check to make sure the path is in menu_links, then check for the path's
    // page_callback value, then make sure the page_callback's function exists.
    // This satisfies a 200 response, otherwise we'll throw a 404.
    if (drupalgap.menu_links[drupalgap.path] && 
        drupalgap.menu_links[drupalgap.path].page_callback &&
      eval('typeof ' + drupalgap.menu_links[drupalgap.path].page_callback) == 'function')
    { status_code = 200; }
    else { status_code = 404; }
    if (drupalgap.settings.debug) { console.log('status code: ' + status_code); }
    return status_code;
  }
  catch (error) {
    alert('drupalgap_page_http_status_code - ' + error);
  }
}


/**
 * Loads the settings specified in DrupalGap/app/settings.js into the app.
 */
function drupalgap_settings_load() {
  try {
    settings_file_path = 'DrupalGap/app/settings.js';
    jQuery.ajax({
      async:false,
      type:'GET',
      url:settings_file_path,
      data:null,
      success:function(){
        if (drupalgap.settings.debug) {
          // Print the js path to the console.
          console.log(settings_file_path);
        }
      },
      dataType:'script',
      error: function(xhr, textStatus, errorThrown) {
        navigator.notification.alert(
          'Failed to load the settings.js file in the DrupalGap/app folder!',
          function(){},
          'Error',
          'OK'
        );
      }
    });
  }
  catch(error) {
    alert('drupalgap_settings_load - ' + error);
  }
}

/**
 * This is called once the <body> element's onload is fired. We then set the
 * PhoneGap 'deviceready' event listener to drupalgap_deviceready().
 */
function drupalgap_onload() {
	document.addEventListener("deviceready", drupalgap_deviceready, false);
}

/*
 * Given a drupal permission machine name, this function returns true if the
 * current user has that permission, false otherwise. Here is example input
 * that checks to see if the current user has the 'access content' permission.
 * 	Example Usage:
 * 		user_access = drupalgap_user_access({'permission':'access content'});
 * 		if (user_access) {
 * 			alert("You have the 'access content' permission.");
 * 		}
 * 		else {
 * 			alert("You do not have the 'access content' permission.");
 * 		}
 */
function drupalgap_user_access(options) {
	try {
		// Make sure they provided a permission.
		if (options.permission == null) {
			alert("drupalgap_user_access - permission not provided");
			return false;
		}
		// User 1 always has permission.
		if (drupalgap.user.uid == 1) {
			return true;
		}
		// For everyone else, assume they don't have permission. Iterate over
		// drupalgap.user.permissions to see if the current user has the given
		// permission, then return the result.
		access = false;
		if (drupalgap.user.permissions && drupalgap.user.permissions.length != 0) {
      $.each(drupalgap.user.permissions, function(index, permission){
        if (options.permission == permission) {
          access = true;
          return;
        }
      });
		}
		return access;
	}
	catch (error) {
		alert("drupalgap_user_access - " + error);
	}
	return false;
}

$('.drupalgap_front').live('click', function(){
    drupalgap_changePage(drupalgap.settings.front);
});

