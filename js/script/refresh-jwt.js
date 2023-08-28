var idleSeconds = 60 * 60, resetTimeSeconds = 40 * 60;
function resetTimer() {
   if (window.idleTimer)
      clearTimeout(window.idleTimer);
   window.idleTimer = setTimeout(whenUserIdle, idleSeconds * 1000);
}
/** request refresh token for each [resetTimeSeconds] (15) minutes */
function resetIntervalRefresh() {
   // clear if interval is exist
   if (localStorage.getItemValue('jwt') && localStorage.getItemValue('jwt') != '') {
      offsetTime = resetTimeSeconds * 1000 - (new Date().getTime() - parseDateTime(localStorage.getItemValue('refresh-time')).getTime());
      if (offsetTime < 0) offsetTime = 0;
      window.offsetTimer = setTimeout(function () {
         requestTokenRefresh();
         window.refresh_jwtInterval = setInterval(function () {
            requestTokenRefresh();
         }, resetTimeSeconds * 1000);
      }, offsetTime);
   } else {
     whenUserIdle();
   }
}

function requestTokenRefresh() {
   $.ajax({
      url: host + "_tokenRefresh.php",
      type: 'post',
      data: { token: localStorage.getItemValue('token'), refresh_token: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') },
      dataType: 'json',
      success: function (_data) {
         if (_data.AUTH == true) {
            localStorage.setItemValue('jwt_refresh', _data.jwt_refresh);
            localStorage.setItemValue('jwt', _data.jwt[0].jwt);
            localStorage.setItemValue('refresh-time', getDateTime(new Date()));
            template_data = {
               token: localStorage.getItemValue('token'),
               jwt: localStorage.getItemValue('jwt'),
               private_key: localStorage.getItemValue('userID'),
               role: JSON.parse(localStorage.getItemValue('int_acl_short')),
               login_id: localStorage.getItemValue('userID')
            };
            $.ajax({
               url: link._saveSession,
               type: 'post',
               data: { data: { jwt: _data.jwt[0].jwt, jwt_refresh: _data.jwt_refresh } },
            })
         } else {
            whenUserIdle();
         }
      }
   });
}

function clearTaskJWT() {
   if (window.idleTimer)
      clearTimeout(window.idleTimer);
   if (window.refresh_jwtInterval) {
      clearInterval(window.refresh_jwtInterval);
   }
   if (window.offsetTimer) {
      clearTimeout(window.offsetTimer);
   }
}

function whenUserIdle() {
   clearTaskJWT();
   logout();
}

if (localStorage.getItemValue('jwt') && localStorage.getItemValue('jwt') != '') {
   $(document.body).bind('mousemove wheel keydown click', function (e) {
      resetTimer();
   }); //space separated events list that we want to monitor
   if (!localStorage.getItemValue('refresh-time')) {
      localStorage.setItemValue('refresh-time', getDateTime(new Date()));
   }
   resetTimer(); // Start the timer when the page loads
   resetIntervalRefresh();
}
