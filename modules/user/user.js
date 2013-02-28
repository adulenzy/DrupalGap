/**
 * Implements hook_menu().
 */
/*function user_menu() {
  var items = {
    'user/login':{
      'page callback':'user_login',
    },
  };
  return items;
}*/

function user_login() {
  var form = {
    'id':'user_login',
    'entity_type':'user',
    'elements':{
      'name':{
        'type':'textfield',
        'title':'Username',
        'required':true,
      },
      'pass':{
        'type':'password',
        'title':'Password',
        'required':true,
      },
      'submit':{
        'type':'submit',
        'value':'Login',
      },
    },
  };
  return form;
}

function user_login_submit(form, form_state) {
  try {
    drupalgap.services.drupalgap_user.login.call({
      'name':drupalgap.form_state.values.name,
      'pass':drupalgap.form_state.values.pass,
      'success':function(result){
        $.mobile.changePage(drupalgap.settings.front);
      },
    });
  }
  catch (error) {
    alert('user_login_submit - ' + error);
  }
  
}

function user_register() {
  var form = {
    'id':'user_register',
    'entity_type':'user',
    'elements':{
      'name':{
        'type':'textfield',
        'title':'Username',
        'required':true,
        'description':'Spaces are allowed; punctuation is not allowed except for periods, hyphens, apostrophes, and underscores.',
      },
      'pass':{
        'type':'password',
        'title':'Current password',
        'required':false,
        'description':'Enter your current password to change your <span style="text-decoration: italic;">E-mail address</span>.',
      },
      'mail':{
        'type':'email',
        'title':'E-mail address',
        'required':true,
      },
      'submit':{
        'type':'submit',
        'value':'Create new account',
      },
    },
  };
  return form;
}

function user_register_submit(form, form_state) {
  try {
    drupalgap.services.user.register.call({
      'name':drupalgap.form_state.values.name,
      'mail':drupalgap.form_state.values.mail,
      'success':function(data){
        $.mobile.changePage(drupalgap.settings.front);
      },
    });
  }
  catch (error) {
    alert('user_register_submit - ' + error);
  }
}

function user_profile_form() {
  var form = {
    'id':'user_profile_form',
    'entity_type':'user',
    'elements':{
      'name':{
        'type':'textfield',
        'title':'Username',
        'required':true,
      },
      'mail':{
        'type':'email',
        'title':'E-mail address',
        'required':true,
      },
      'submit':{
        'type':'submit',
        'value':'Create new account',
      },
    },
    'buttons':{
      'cancel':{
        'title':'Cancel',
      },
    },
  };
  return form;
}

function user_profile_form_loaded() {
  try {
    // Are we editing a user?
    if (drupalgap.account_edit.uid) {
      // Retrieve the user and fill in the form values.
      drupalgap.services.user.retrieve.call({
        'uid':drupalgap.account_edit.uid,
        'success':function(account){
          // Set the drupalgap account edit.
          drupalgap.account_edit = account;
          // Load the entity into the form.
          drupalgap_entity_load_into_form('user', null, drupalgap.account_edit, drupalgap.form);
          /*$('#name').val(account.name);
          if (account.mail) {
            $('#mail').val(account.mail);
          }
          else {
            $('#mail').hide();
            $('#current_pass').hide();
          }
          */
          /*if (account.picture) {
            $('#edit_picture').attr('src', drupalgap_image_path(account.picture.uri)).show();
          }*/
        }
      });
    }
  }
  catch (error) {
    alert('node_edit_loaded - ' + error);
  }
}

function user_profile_form_submit(form, form_state) {
  try {
    var user = drupalgap_entity_build_from_form_state();
    drupalgap_entity_form_submit(user);
  }
  catch (error) {
    alert('user_profile_form_submit - ' + error);
  }
}

