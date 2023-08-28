$(document).ready(function(){	

	$("#submit").click(function(){
      //alert('aa');
      var __mData = {};         
      __mData.email = $("#iptEmail").val();
      $.ajax({
         url: link._firebase_sendPasswordResetEmail,         
         type: 'POST',
         data: __mData,
         dataType: 'json',
         success: function (_data) {
            if (typeof _data.email !== 'undefined')
            {
               //true
               messageForm("Check message in your mail !", true);
               location.href = ('./signin.php');
            }else{
               //false
               messageForm(_data.error.message, false);
            }
         }, 
      }).done(function(){
         //location.reload();
      })
   });
   
});
