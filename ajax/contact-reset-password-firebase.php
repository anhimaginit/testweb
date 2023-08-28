<section class="smart-form">
   <fieldset>
      <legend>Reset Password</legend>
      <section>
         <div id="reset_password_msg" class="text-danger" role="alert" style="display:none"></div>
      </section>
      <section id="password">
         <label class="label-input">Please Enter Password</label>
         <input type="password" class="form-control col col-12" name="resetPassword" id="resetPassword">
      </section>
      <section id="confirm_password">
         <label class="label-input">Please Enter Confirm Password</label>
         <input type="password" class="form-control col col-12" name="resetConfirmPassword" id="resetConfirmPassword">
      </section>
   </fieldset>
   <fieldset class="text-right" id="reset_password_btn_field">
      <button type="button" class="btn btn-sm btn-primary" id="reset_password_btn">Reset Password</button>
      <button type="button" class="btn btn-sm btn-default" id="modal-close-reset-form" data-backdrop="false" data-dismiss="modal">Cancel</button>
   </fieldset>
</section>

<script>
   var el4 = document.getElementById("btnModalResetPassword");
   if (el4) {
      el4.addEventListener('click', function(e) {
         var email = document.getElementById("user_name").value;
         var pass = document.getElementById("resetPassword").value;
         var confirm_pass = document.getElementById("resetConfirmPassword").value;

         if (pass != confirm_pass) {
            $("#resetPasswordFirebase #reset_password_msg").html('Password is mismatch');
            $("#resetPasswordFirebase #reset_password_msg").css({
               "display": ""
            });
            return;
         }

         firebase.auth().createUserWithEmailAndPassword(email, pass)
            .then(function() {
               var __mData = {};
               __mData.email = firebase.auth().currentUser.email;
               $('#modal-close-reset-form').click();
            })
            .catch(function(error) {
               $('#modal-close-reset-form').click();

               var email = document.getElementById("user_name").value;
               var __mData = {
                  email: email
               };
               $.ajax({
                  url: link._firebase_sendPasswordResetEmail,
                  type: 'POST',
                  data: __mData,
                  dataType: 'json',
                  success: function(_data) {

                     if (typeof _data.email !== 'undefined') {
                        //true
                        alert("Check message in you mail !");
                        var _phoneNoteData = {
                           create_date: getDateTime(new Date()),
                           note: 'Request change password',
                           description: '',
                           type: 'Contact',
                           contactID: $('input[name=ID]').val(),
                           enter_by: localStorage.getItemValue('userID'),
                           internal_flag : 1
                        };
                        _notecontact.insertNewNoteToDB(_phoneNoteData, function(data) {
                           _phoneNoteData.enter_by_name = localStorage.getItemValue('user_name');
                           _phoneNoteData.noteID = res.id;
                           _notecontact.createTableNoteRow(_phoneNoteData);
                        });
                     } else {
                        //false                  
                        alert(_data.error.message);
                     }
                  },
               }).done(function() {
                  //location.reload();
               })
               //
            });
      });
   }
</script>