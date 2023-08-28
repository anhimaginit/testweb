$('#reset_password_btn').click(function(){

    var password = $('#resetPassword').val();
    var confirmPassword = $('#resetConfirmPassword').val();
    var email = $('#user_name').val(); 
 
    if(password == confirmPassword)
    {
       firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
             
       if(errorCode == 'auth/email-already-in-use')
       {
          var __mData = {};         
          __mData.email = email;
          $.ajax({
             url: link._firebase_sendPasswordResetEmail,         
             type: 'POST',
             data: __mData,
             dataType: 'json',
             success: function (_data) {
                if (typeof _data.email !== 'undefined')
                {
                   //true
                   alert("Please check "+email+" mail box !");
                   $("#reset_password_msg").html("Please check "+email+" mail box !");
                   $("#reset_password_msg").css({ "display": "" });
                }else{
                   //false                  
                   $("#reset_password_msg").html('Mail is not exist');
                   $("#reset_password_msg").css({"display": "" });
                }
             }, 
          }).done(function(){
             //location.reload();
          })
       }else{
          $("#reset_password_msg").html(errorMessage);
          $("#reset_password_msg").css({ "display": "" });
       }
 
       });
    }else{
       $("#reset_password_msg").html('Password is mismatch');
       $("#reset_password_msg").css({ "display": "" });
    }
 
   
 });
   