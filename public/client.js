window.addEventListener('load', function() {

  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
    responseType: 'token id_token',
    scope: 'openid',
    leeway: 60
  });

  var loginBtn = document.getElementById('pzloginBtn');

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

});

function isAuthenticated() {
  // Check whether the current time is past the
  // access token's expiry time
  var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  return new Date().getTime() < expiresAt;
}

function handleAuthentication() {
  webAuth.parseHash(function(err, authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      setSession(authResult);
      loginBtn.style.display = 'none';
      homeView.style.display = 'inline-block';
    } else if (err) {
      homeView.style.display = 'inline-block';
      console.log(err);
      alert(
        'Error: ' + err.error + '. Check the console for further details.'
      );
    }
    displayButtons();
  });
}