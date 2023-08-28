function ContactAppend() { }

ContactAppend.prototype.constructor = ContactAppend;
ContactAppend.prototype = {
   init: function () {
      url_open = this.url_open;
      // editUsername = this.editUsername;
      // requestResetPassword = this.requestResetPassword;
      // resetPassword = this.resetPassword;
      this.bindEvent();
   },
   bindEvent: function () {
      // $('input[name=current_password]').focusout(function () {
      //    ContactAppend.prototype.requestResetPassword();
      // });
      $('input').keyup(function () {
         $('#reset_password_msg').css('display', 'none');
      });

      $('#btnUpdateUsername').on('click', function () {
         ContactAppend.prototype.editUsername();
      });
   },
   url_open: function () {
      //get url:
      var _url_protocol = $('#url_protocol').val();
      var _url_host = $('#url_host').val();

      if (_url_host) {
         if (_url_host.startsWith('https://') || _url_host.startsWith('http://')) {
            window.open(_url_host, '_blank');
         }
         else {
            window.open(_url_protocol + _url_host, '_blank');
         }
      }
   },

   checkUsernameExist: function (username, callback) {
      $.ajax({
         url: link._userExisting,
         type: 'post',
         data: { token: localStorage.getItemValue('token'), user_name: username, contactID: $('[name=ID]').val() },
         dataType:'json',
         success: function (res) {
            if (res.ERROR == '') {
               if (res.USER == '') {
                  $('.modal').modal('hide');
                  $('#user_name').attr('readonly', true);
                  $('#btnEditUsername').show();
                  $('#btnModalResetPassword').show();
                  $('#btnCancelUsername').hide();
                  $('#btnUpdateUsername').hide();
                  if(username==$('[name=primary_email').val()){
                     callback(false);
                  }else{
                     callback('Your old username is same with new username');
                     return;
                  }
               }else{
                  callback('Username is already exist');
               }
            } else {
               callback(res.ERROR);
            }
         }
      })
   },

   usernameError: function (mes) {
      if ($.contains(document.body, document.getElementById('user_name-error'))) {
         $('#user_name-error').text(mes);
      } else {
         $('#user_name').closest('div').before('<div class="error" id="user_name-error">' + mes + '</div>');
      }
   },

   editUsername: function () {
      var _self = this;
      $this = $('input[name=user_name]');
      var _prev = $('#primary_username_old').val();
      var _new = $this.val();

      var passWindow, w = 250, h = 150;
      var left = (screen.width / 2) - (w / 2);
      var top = (screen.height / 2) - (h / 2);
      if (_new != '') {
         _self.checkUsernameExist(_new, function (result) {
            if (result == false || window.resetUsernameAction) {
               passWindow = window.open('./js/script/contact/enter-password.php', 'Enter password', 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left + ', titlebar=0, location=0, resizable=0');
               passWindow.onbeforeunload = function () {
                  if(!window.passotherpage) return;
                  $.ajax({
                     url: link._userUpdate,
                     type: 'post',
                     data: { token: localStorage.getItemValue('token'), jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID'), id: $('input[name=ID]').val(), username: _new },
                     dataType: 'json',
                     success: function (res) {
                        if (res.Update == 'Success') {
                           var dataNote = {
                              create_date: getDateTime(new Date()),
                              note: 'Username changed',
                              description: 'Change from ' + _prev + ' to ' + _new,
                              type: 'Contact',
                              contactID: $('input[name=ID]').val(),
                              enter_by: localStorage.getItemValue('userID'),
                              internal_flag : 1
                           }
                           _notecontact.insertNewNoteToDB(dataNote, function (data) {
                              dataNote.enter_by_name = localStorage.getItemValue('user_name');
                              dataNote.noteID = data.id;
                              _notecontact.createTableNoteRow(dataNote);
                           });
                           delete window.resetUsernameAction;
                           firebase.auth().createUserWithEmailAndPassword(_new, window.passotherpage).then(function () {
                              $('.modal').modal('hide');
                              $('#user_name-error').remove();
                              $('#user_name').attr('readonly', true);
                              $('#btnEditUsername').show();
                              $('#btnModalResetPassword').show();
                              $('#btnCancelUsername').hide();
                              $('#btnUpdateUsername').hide();
                              messageForm('Your username is changed', true, '#username_message');
                              delete window.passotherpage;
                           }).catch(function (error) {
                              if(_new == contact_old.primary_email){
                                 messageForm('The username is changed', true, '#username_message');
                              }else{
                                 _self.usernameError(error.message);
                              }
                              $('.modal').modal('hide');
                           });
                        } else {
                           _self.usernameError(res.ERROR);
                        }
                     }
                  })
               }

            } else {
               _self.usernameError(result);
            }
         })
      } else {
         _self.usernameError('Please enter username');
      }
   },
}
var mes = function (status, msg) {
   if (status == true) {
      $('#reset_password_msg').html(msg);
      $('#reset_password_msg').remove('alert alert-danger');
      $('#reset_password_msg').addClass('alert alert-success');
      $('#reset_password_msg').show();
   } else {
      $('#reset_password_msg').html(msg);
      $('#reset_password_msg').remove('alert alert-success');
      $('#reset_password_msg').addClass('alert alert-danger');
      $('#reset_password_msg').show();
   }
}
var _ContactAppendOpen = new ContactAppend();
_ContactAppendOpen.init();