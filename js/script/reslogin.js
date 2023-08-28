function ReLogin(type) {
   if (type) {
      this.setLoginType();
      this.type = type;
   }
}
ReLogin.prototype.constructor = ReLogin;
ReLogin.prototype = {
   init: function () {
      $("#login_form").validate(this.validatorLoginOption);
      this.bindEvent();
   },

   bindEvent: function () {
      $('input').mousedown(function () {
         $('#error_login').empty();
      });

      //firebase-------------
      $('#btnSignUp').unbind('click').bind('click', function () {
         $("#signup-form #err-msg").css({ "display": "none" });
         $('#sign-up_modal').show();
         $('#login_form').css({ "display": "none" })
      });

      $('#btn-cancel').unbind('click').bind('click', function () {
         $("#signup-form #err-msg").css({ "display": "none" });
         $("#signup-form #err-msg").html('');
         $('#sign-up_modal').hide();
         $('#login_form').css({ "display": "" })
      });

      var el = document.getElementById("btn-sign-up");
      if (el) {
         document.getElementById("btn-sign-up").addEventListener('click', function (e) {
            var email = document.getElementById("email_signup").value;
            var pass = document.getElementById("password_signup").value;
            var confirm_pass = document.getElementById("password_confirm").value;
            if (pass != confirm_pass) {
               $("#signup-form #err-msg").html('Password is mismatch');
               $("#signup-form #err-msg").css({ "display": "" });
               return;
            }

            firebase.auth().createUserWithEmailAndPassword(email, pass)
               .then(function () {
                  var __mData = {};
                  __mData.email = firebase.auth().currentUser.email;
                  $.ajax({
                     url: link._emailRegister,
                     type: 'POST',
                     data: __mData,
                     dataType: 'json',
                     success: function (_data) {
                        $('#sign-up_modal').hide();
                        $('#login_form').css({ "display": "" })
                        $("error_login").html("Please check your Inbox and click register email");
                        setTimeout(function () {
                           $("error_login").html("");
                        }, 5000)
                     }, error: function (e) {
                        $("#signup-form #err-msg").html(e);
                        $("#signup-form #err-msg").css({ "display": "" });
                     }
                  });
               })
               .catch(function (error) {
                  $("#signup-form #err-msg").html(error.message);
                  $("#signup-form #err-msg").css({ "display": "" });
               });
         });
      }

      //sign in
      $('#btnLogin').unbind('click').bind('click', function () {
         $("#signin-form #err-msg-signin").css({ "display": "none" });
         $("#signin-form #err-msg-signin").html('');
         $('#sign-in_modal').show();
         $('#login_form').css({ "display": "none" })
      });

      $('#btn-signin-cancel').unbind('click').bind('click', function () {
         $("#signin-form #err-msg-signin").css({ "display": "none" });
         $("#signin-form #err-msg-signin").html('');
         $('#sign-in_modal').hide();
         $('#login_form').css({ "display": "" })
      });

      var el1 = document.getElementById("btn-signin");
      if (el1) {
         el1.addEventListener('click', function (e) {
            const email = document.getElementById("txtEmail").value;
            const pass = document.getElementById("txtPassword").value;
            const promise = firebase.auth().signInWithEmailAndPassword(email, pass)
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
                           location.reload();
                        } else {
                           if (_data.exsiting == "") {
                              $('#sign-in_modal').hide();
                              $('#login_form').css({ "display": "" })
                              var msg = _data.ERROR
                              $('#error_login').html('<div class="alert alert-danger">' + msg + '</div>');
                           } else {
                              $('#sign-in_modal').hide();
                              $('#login_form').css({ "display": "" })
                              var msg = _data.ERROR;
                              $('#error_login').html('<div class="alert alert-danger">' + msg + '</div>');
                           }

                        }
                     },
                  });
               }).catch(function (error) {
                  var errorCode = error.code;
                  var errorMessage = error.message;

                  if (errorCode === 'auth/wrong-password') {
                     errorMessage = 'Wrong password.'
                  }

                  $("#signin-form #err-msg-signin").css({ "display": "" });
                  $("#signin-form #err-msg-signin").html(errorMessage);
               });
      });
   }


      //google
      var ggProvider = new firebase.auth.GoogleAuthProvider();
   var btnGoogle = document.getElementById('btnGoogle');

   //Sing in with Google
   if(btnGoogle) {
      btnGoogle.addEventListener('click', function (e) {
         firebase.auth().signInWithPopup(ggProvider).then(function (result) {
            var token = result.credential.accessToken;
            var user = result.user.email;
            var __mData = {};
            __mData.token = localStorage.getItemValue('token');
            __mData.primary_email = user;
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
                     Login.prototype.setDataCookie(_data, __mData);
                  } else {
                     var msg = __mData.login_type == 1 ? 'Email or Phone is incorrect' : __mData.login_type == 2 ? 'Email or Zipcode is incorrect' : 'Phone or Zipcode is incorrect';
                     msg += '<br> or Your permission is not an ' + __mData.type;
                     $('#error_login').html('<div class="alert alert-danger">' + msg + '</div>');
                  }
               },
            }).done(function () {
               //location.reload();
            })
         }).catch(function (error) {
         })
      }, false)
   }
},

   setType: function (type) {
      if (type)
         this.type = type;
   },

setIP: function (ip) {
   this.ip = ip;
   $.cookie('ip_address', ip, { path: '/' });
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

validatorLoginOption: {
   roles: {
   },
   submitHandler: function () {
      ReLogin.prototype.submitForm();
   }
},

submitForm: function () {
   firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
         // User is signed in.
         var __mData = {};
         __mData.token = localStorage.getItemValue('token');
         __mData.primary_email = user.email;
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
                  Login.prototype.setDataCookie(_data, __mData);
                  location.reload();
               } else {
                  var msg = 'Your permission is not an ' + __mData.type + ' !';
                  $('#error_login').html('<div class="alert alert-danger">' + msg + '</div>');
               }
            },
         });

      }
   });
},
}
loadScript('js/script/login-1.js');