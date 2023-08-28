function logout() {
   $.ajax({
      url: host2+'logout.php',
      type: 'post',
      data: {},
      success: function () {
         var token = localStorage.getItemValue('token');
         firebase.auth().signOut().then(function () {
         }, function (error) {
         });
         localStorage.clear();
         sessionStorage.clear();
         localStorage.setItemValue('token', token);
         if (window.idleTimer)
            clearTimeout(window.idleTimer);
         if (window.refresh_jwtInterval)
            clearInterval(window.refresh_jwtInterval);
         if (window.offsetTimer) {
            clearTimeout(window.offsetTimer);
         }
         if(window.gapi && gapi.auth2 && window.handleSignoutClick){
            handleSignoutClick();
         }
         window.location.replace('signin.php');
      }
   })
}