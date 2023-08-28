function getUiConfig() {
  return {
    'callbacks': {
      'signInSuccess': function (user, credential, redirectUrl) {
        handleSignedInUser(user);
        return false;
      }
    },
    'signInFlow': 'popup',
    'signInOptions': [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: 'image',
          size: 'invisible',
          badge: 'bottomleft'
        },
        defaultCountry: 'VN',
        defaultNationalNumber: '1234567890',
        loginHint: '+11234567890'
      }
    ],
    'tosUrl': 'https://www.google.com'
  };
}

var ui = new firebaseui.auth.AuthUI(firebase.auth());

var handleSignedInUser = function (user) {
  document.getElementById('user-signed-in').style.display = 'block';
  document.getElementById('user-signed-out').style.display = 'none';
  document.getElementById('phone').textContent = user.phoneNumber;

  // firebase data res
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
        _data.firebase_user = JSON.parse(JSON.stringify(user.user));
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
};
var handleSignedOutUser = function () {
  document.getElementById('user-signed-in').style.display = 'none';
  document.getElementById('user-signed-out').style.display = 'block';
  ui.start('#firebaseui-container', getUiConfig());
};

firebase.auth().onAuthStateChanged(function (user) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('loaded').style.display = 'block';
  user ? handleSignedInUser(user) : handleSignedOutUser();
});

var initFirebaseApp = function () {
  document.getElementById('sign-out').addEventListener('click', function () {
    firebase.auth().signOut();
  });
};

document.addEventListener('load', initFirebaseApp);

loadScript('js/script/login-1.js');