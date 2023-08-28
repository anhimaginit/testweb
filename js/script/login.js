function Login(type) {
   if (type) {
      this.setLoginType();
      this.type = type;
   }
   Login.prototype.setIP($.cookie('ip_address'));
}
Login.prototype.constructor = Login;
Login.prototype = {
   init: function () {
      this.bindEvent();
      // this.setViewPhoneAuth();
   },

   bindEvent: function () {
      let _self = this;

      $('input').mousedown(function () {
         $('#error_login').empty();
         $('#error_login').hide();
      });

      $('[data-toggle="switch"]').click(function () {
         $('.switch-box').hide();
         $($(this).data('target')).show();
      });

      $('#btnSignUp').unbind('click').bind('click', function () {
         $("#error_login").css({ "display": "none" });
         $('#signin').hide();
         $('#signup').show();
      });

      $('#btn-cancel').unbind('click').bind('click', function () {
         $("#error_login").css({ "display": "none" });
         $("#error_login").html('');
         $('#signup').hide();
         $('#signin').show();
      });

      $('.btnSigninPhone').click(function () {
         _self.loginPhone();
      });

      $('.btnSigninEmail').click(function () {
         _self.loginEmail();
      });

      $('#btnGoogle').click(function () {
         _self.loginGoogle();
      });

      $('#btn-sign-up').click(function () {
         _self.registerAccount();
      });

   },
   setViewPhoneAuth: function () {
      const uiConfig = {
         signInOptions: [
            firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
         ],

      }
      window.ui_login_firebase = new firebaseui.auth.AuthUI(firebase.auth());
      ui_login_firebase.start('#firebase_signin_box', uiConfig);
   },

   setType: function (type) {
      if (type)
         this.type = type;
   },

   setIP: function (ip) {
      this.ip = ip;
      if (ip.length >= 8) {
         $.cookie('ip_address', ip, { path: '/' });
      }
   },

   setLoginType: function () {
      // set login type for API
      if (this.primary_email && this.primary_phone) {
         this.login_type = 1;
      } else if (this.primary_email && this.primary_postal_code) {
         this.login_type = 2;
      } else if (this.primary_phone && this.primary_postal_code) {
         this.login_type = 3;
      }
   },

   errorLogin: function (element, message) {
      if (message) {
         $(element).html('<p class="error">' + message + '</p>')
      } else {
         $(element).empty();
      }
   },

   loginGoogle: function () {
      waitingDialog.show();
      var ggProvider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(ggProvider).then(function (result) {
         waitingDialog.show();
         var token = result.credential.accessToken;
         var user = result.user.email;
         var __mData = {};
         __mData.token = localStorage.getItemValue('token');
         __mData.primary_email = result.user.email;
         __mData.login_type = 5;
         __mData.ip = $.cookie('ip_address');
         __mData.type = $('select[name="types"]').val();
         $.ajax({
            url: link._login,
            type: 'POST',
            data: __mData,
            dataType: 'json',
            success: function (_data) {
               if (_data.AUTH == true) {
                  _data.firebase_user = JSON.parse(JSON.stringify(result.user));
                  Login.prototype.setDataCookie(_data, __mData);
                  waitingDialog.hide()
               } else {
                  if (_data.exsiting == "" && __mData.login_type == 5) {
                     messageForm(_data.ERROR, false, '#error_login');
                  } else {
                     var msg = '<br> Your permission is not an ' + __mData.type;
                     messageForm(msg, false, '#error_login');
                  }
                  waitingDialog.hide()
               }
            },
            error: function (err) {
               messageForm(err.error + ', Please close browser and open it again', false, '#error_login');
               waitingDialog.hide()
            }
         })

      }).catch(function (error) {
         if (localStorage.getItemValue('token') == null || localStorage.getItemValue('token') == undefined) {
            $('#error_login').html('<div class="alert alert-danger">Please refresh Signin page</div>');
         } else {
            $('#error_login').html('<div class="alert alert-danger">' + error.message + ', Please close browser and open it again</div>');
         }
      })
   },

   loginEmail: function () {
      waitingDialog.show();
      let email = $('#email-box input.email').val();
      let password = $('#email-box input.password').val();
      if (!email || email == '' || !password || password == '') {
         messageForm('Please enter your information', false, '#error_login');
         waitingDialog.hide();
         return;
      }
      firebase.auth().signInWithEmailAndPassword(email, password)
         .then(function (user) {
            var __mData = {};
            __mData.token = localStorage.getItemValue('token');
            __mData.primary_email = email;
            __mData.login_type = 5;
            __mData.ip = $.cookie('ip_address');
            __mData.type = $('select[name="types"]').val();
            $.ajax({
               url: link._login,
               type: 'POST',
               data: __mData,
               dataType: 'json',
               success: function (_data) {
                  if (_data.AUTH == true) {
                     _data.firebase_user = JSON.parse(JSON.stringify(user.user));
                     Login.prototype.setDataCookie(_data, __mData);
                  } else {
                     messageForm(_data.ERROR, false, '#error_login');
                  }
                  waitingDialog.hide();
               },
            })
         }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode === 'auth/wrong-password') {
               errorMessage = 'Wrong password.'
            }
            messageForm(errorMessage, false, '#error_login');

            if (localStorage.getItemValue('token') == null || localStorage.getItemValue('token') == undefined) {
               messageForm('Please refresh Signin page', false, '#error_login');
            }
            waitingDialog.hide();
         });
   },

   loginPhone: function () {
      waitingDialog.show();
      let phone = $('#phone-box .email').val();
      let password = $('#phone-box .password').val();
   },

   registerAccount: function () {
      let email = $('#signup .email').val();
      let password = $('#signup .password').val();
      let confirm_pass = $('#signup .password_confirm').val();

      if (password != confirm_pass) {
         messageForm('Confirm Password is incorrect', 'danger', '#error_login')
         return;
      }

      firebase.auth().createUserWithEmailAndPassword(email, password)
         .then(function (result) {
            var __mData = {};
            __mData.email = firebase.auth().currentUser.email;
            $.ajax({
               url: link._emailRegister,
               type: 'POST',
               data: __mData,
               dataType: 'json',
               success: function (_data) {
                  if (_data.existing) {
                     $("#error_login").html("The email address is already used");
                     $("#error_login").css({ "display": "" });
                  } else {
                     $('#signup').hide();
                     $('#signin').show();
                     messageForm('A register email was sent to you. Please check your email and complete register', 'success', '#error_login');
                  }
               }, error: function (e) {
                  messageForm(e, 'danger', '#error_login')
               }
            });
         })
         .catch(function (error) {
            messageForm(error.message, 'danger', '#error_login')
         });
   },
   /**
    * 
    * @param {JSON} _data : response from login form
    * @param {JSON} __mData : data from login form
    */
   setDataCookie: function (_data, __mData) {
      var short = []; var form_access = [];
      var int__acl = _data.contact.acl_list.int_acl;
      if (int__acl.length > 0) int__acl = int__acl[0];
      short.push({
         department: int__acl.unit,
         level: int__acl.level,
         group: int__acl.group_name
      });

      if (int__acl.acl_rules[0] != undefined) int__acl.acl_rules = int__acl.acl_rules[0];

      for (var key in int__acl.acl_rules) {
         form_access.push(key);
      }

      _data.short = short;
      _data.actor = __mData.type;
      Login.prototype.setLocalStorageLogin(_data);

      var saveData = {
         'token': localStorage.getItemValue('token'),
         "actor": _data.actor,
         'level': int__acl.level,
         'int_acl_short': _data.short,
         'user_name': _data.contact.first_name + ' ' + _data.contact.last_name,
         'userID': _data.contact.ID,
         company_id: _data.contact.company_name,
         gps: _data.contact.gps,
         "jwt": _data.contact.jwt,
         "jwt_refresh": _data.contact.jwt,
         "int_acl": int__acl,
         "token": localStorage.getItemValue('token'),
         "form_access": form_access,
         'firebase_user': _data.firebase_user
         // 'IDs': _data.contact.IDs
      };

      template_data = {
         token: localStorage.getItemValue('token'),
         jwt: _data.contact.jwt,
         private_key: _data.contact.ID,
         role: _data.short,
         login_id: _data.contact.ID
      };

      delete _data.contact.jwt;
      delete _data.contact.jwt_refresh;
      delete _data.contact.IDs;
      delete _data.contact.acl_list;
      saveData.user_info = _data.contact;
      delete saveData.user_info.archive_id;

      // $.cookie("user", JSON.stringify(saveData.user), { path: '/' });
      Login.prototype.saveSession(saveData);
   },
   setLocalStorageLogin: function (_data) {
      localStorage.setItemValue('jwt', _data.contact.jwt);
      localStorage.setItemValue('jwt_refresh', _data.contact.jwt);
      localStorage.setItemValue('int_acl_short', JSON.stringify(_data.short));
      localStorage.setItemValue('level', _data.short[0].level);
      localStorage.setItemValue('userID', _data.contact.ID);
      localStorage.setItemValue('actor', _data.actor);
      localStorage.setItemValue('user_name', _data.contact.first_name + ' ' + _data.contact.last_name);

      localStorage.setItemValue('claimIDs', JSON.stringify(_data.contact.IDs.claimIDs));
      template_data = { token: _token, jwt: _data.contact.jwt, private_key: _data.contact.ID, role: _data.short };

   },

   saveSession: function (_data) {
      return $.ajax({
         url: link._saveSession,
         type: 'post',
         data: { data: _data },
         success: function (res) {
            var _path = host2 + '#ajax/dashboard.php'
            // if ($.cookie('prePage') != undefined || $.cookie('prePage') != null) {
            //    if ($.cookie('prePage').indexOf("register-form.php") == -1) {
            //       _path = $.cookie('prePage') ? decodeURIComponent($.cookie('prePage')) : host2 + '#ajax/dashboard.php';
            //    }
            // }
            document.location.href = _path;
         }
      });
   },

}


/**
 * Module for displaying "Waiting for..." dialog using Bootstrap
 *
 * @author Eugene Maslovich <ehpc@em42.ru>
 */

var waitingDialog = waitingDialog || (function ($) {
   'use strict';

   // Creating modal dialog's DOM
   var $dialog = $(
      '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
      '<div class="modal-dialog modal-m">' +
      '<div class="modal-content">' +
      '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
      '<div class="modal-body">' +
      '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
      '</div>' +
      '</div></div></div>');

   return {
      /**
       * Opens our dialog
       * @param message Custom message
       * @param options Custom options:
       * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
       * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
       */
      show: function (message, options) {
         // Assigning defaults
         if (typeof options === 'undefined') {
            options = {};
         }
         if (typeof message === 'undefined') {
            message = 'Loading';
         }
         var settings = $.extend({
            dialogSize: 'm',
            progressType: '',
            onHide: null // This callback runs after the dialog was hidden
         }, options);

         // Configuring dialog
         $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
         $dialog.find('.progress-bar').attr('class', 'progress-bar');
         if (settings.progressType) {
            $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
         }
         $dialog.find('h3').text(message);
         // Adding callbacks
         if (typeof settings.onHide === 'function') {
            $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
               settings.onHide.call($dialog);
            });
         }
         // Opening dialog
         $dialog.modal();
      },
      /**
       * Closes dialog
       */
      hide: function () {
         $dialog.modal('hide');
      }
   };

})(jQuery);
