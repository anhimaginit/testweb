
$(document).ready(function(){	

	$("#createNewPassword").click(function(){
	
		 var __mData = {};         
		 __mData.oobCode = $("#oobCode").val();
		 __mData.newPassword = $("#password2").val();
		 __mData.newPassword1 = $("#password1").val();
		 __mData.newPassword2 = $("#password2").val();
		
		var checkValidate = true;
		
		if(__mData.oobCode.length < 3)
		{			
			checkValidate = false;
			$("#msg_field_1").html("Code is incorrect");			
		}else
		{
			$("#msg_field_1").html("");
		}

		if(__mData.newPassword1.length < 6)
		{
			checkValidate = false;
			$("#msg_field_2").html("Password between 6 and 20 characters");		
		}else
		{
			$("#msg_field_2").html("");
		}

		if(__mData.newPassword2.length < 6)
		{
			checkValidate = false;
			$("#msg_field_3").html("Confirm Password between 6 and 20 characters");		
		}else
		{
			$("#msg_field_3").html("");
		}

		if(__mData.newPassword2 !== __mData.newPassword1)
		{
			checkValidate = false;
			$("#msg_field_3").html("Confirm Password is not match");		
		}else
		{
			$("#msg_field_3").html("");
		}

		if (checkValidate = true)
		{
			$.ajax({
				url: link._firebase_confirmPasswordReset,         
				type: 'POST',
				data: __mData,
				dataType: 'json',
				success: function (_data) {
					if (typeof _data.email !== 'undefined')
					{
						//true
						//console.log(_data.email);
						alert("Create New Password Success !");
						location.href = ('/signin.php');
					}else{
						//false
						alert(_data.error.message);
						//console.log(_data);
					}
				}, error: function (e) {
					//console.error(e);
				}
			}).done(function(){
				// location.reload();
			});
		}
   });
   
});
