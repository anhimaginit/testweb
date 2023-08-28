<fieldset>
  <input type="hidden" id="primary_username_old">
  <div class="row">
    <div id="username_message" role="alert" style="display:none"></div>
    <section class="col">
      <label class="label">Username</label>
      <div class="input-group-btn">
        <input type="text" name="user_name" class="form-control col col-6" id="user_name" readonly="true" autocomplete="off" value="">
        <button type="button" class="btn btn-sm btn-primary" id="btnEditUsername">Edit</button>
        <button type="button" class="btn btn-sm btn-primary" style="display:none" id="btnUpdateUsername">Update</button>
        <button type="button" class="btn btn-sm btn-default" style="display:none" id="btnCancelUsername">Reset Username</button>
        <button type="button" class="btn btn-sm btn-warning" id="btnModalResetPassword">Reset password</button>
      </div>
    </section>
  </div>

</fieldset>

<script>
  $(document).on('click', '#btnEditUsername', function() {
    $('#user_name').attr('readonly', false);
    $(this).hide();
    $('#user_name-error').remove();
    $('#btnModalResetPassword').hide();
    $('#btnUpdateUsername').show();
    $('#btnCancelUsername').show();
  }).on('click', '#btnCancelUsername', function() {
    $(this).hide();
    $('#user_name-error').remove();
    $('#btnUpdateUsername').hide();
    $('#btnModalResetPassword').show();
    $('#btnEditUsername').show();
    $('#user_name').attr('readonly', true);
    $('#user_name').val($('#primary_username_old').val());
    window.resetUsernameAction = true;
    $('#btnUpdateUsername').click();
  });
  var el4 = document.getElementById("btnModalResetPassword");
  if (el4) {
    el4.addEventListener('click', function(e) {
      var email = document.getElementById("user_name").value;
      // var pass = document.getElementById("resetPassword").value;
      // firebase.auth().createUserWithEmailAndPassword(email, pass)
      //   .then(function() {
      //     var __mData = {};
      //     __mData.email = firebase.auth().currentUser.email;
      //     $('#modal-close-reset-form').click();
      //   })
      //   .catch(function(error) {
      //     $('#modal-close-reset-form').click();

      //     var email = document.getElementById("user_name").value;
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
            messageForm("Check message in you mail!", true, '#contact_form #username_message');
          } else {
            //false                  
            messageForm(_data.error.message, false, '#contact_form #username_message');
          }
        },
      }).done(function() {
        //location.reload();
      });
      //       //
      //     });
    });
  }
</script>