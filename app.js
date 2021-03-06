window.addEventListener('load', function() {
  var userProfile;
  var content = document.querySelector('.content');
  content.style.display = 'block';
  var verified;


  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email',
    leeway: 60
  });

  var loginStatus = document.querySelector('.container h4');
  var loginView = document.getElementById('login-view');
  var homeView = document.getElementById('home-view');
  var profileView = document.getElementById('profile-view');
  var orderView = document.getElementById('order-view');

  var loginBtn = document.getElementById('userLoginBtn');
  var logoutBtn = document.getElementById('userLogoutBtn');
  var orderBtn = document.getElementById('orderNowBtn');
  var homeViewBtn = document.getElementById('homeBtn');
  var profileViewBtn = document.getElementById('profileBtn');

  homeViewBtn.addEventListener('click', function() {
    homeView.style.display = 'inline-block';
    profileView.style.display = 'none';
    orderView.style.display = 'none';
  });

  profileViewBtn.addEventListener('click', function() {
    homeView.style.display = 'none';
    profileView.style.display = 'inline-block';
    orderView.style.display = 'none';
    getProfile();
  });

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

  orderBtn.addEventListener('click', function() {
    homeView.style.display = 'inline-block';
    profileView.style.display = 'none';
    orderView.style.display= 'inline-block';
    isVerified();
  });

  logoutBtn.addEventListener('click', logout);

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    displayButtons();
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }


  function displayButtons() {
    var loginStatus = document.querySelector('.container h4');
    if (isAuthenticated()) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      profileViewBtn.style.display = 'inline-block';
      orderBtn.style.display = 'inline-block';
      orderView.style.display = 'inline-block';
      loginStatus.innerHTML =
        'You are logged in.';
    } else {
      homeView.style.display = 'inline-block';
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      profileViewBtn.style.display = 'none';
      profileView.style.display = 'none';
      orderBtn.style.display = 'none';
      orderView.style.display = 'none';
      loginStatus.innerHTML =
        'Please login to order a pizza.';
    }
  }//end displayButtons

function sendOrder() {      
    console.log('calling API');
    // add an entry into the DB via the pizza42 api
    axios.post(PIZZAURL, {
      userId: userProfile.sub,
      email: userProfile.email
    })
    .then(function (response) {
      console.log(`SUCcESS`);
    })
    .catch(function (error) {
      console.log(error);
    });
    
  } 

function isVerified() {
  var accessToken = localStorage.getItem('access_token');
  var loginStatus = document.querySelector('.container h4');

  if (verified){
    console.log(`customer can order a pizza`);
    sendOrder();  
    loginStatus.innerHTML =
        'Your account has been verified.  One large pizza will arrive at your house within the hour.'    
  }
  else{
    loginStatus.innerHTML =
      'Please use the verify email link sent to your address for Quick Order access'
  }
};//end ifVerified

function getProfile() {
  if (!userProfile) {
      var accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        console.log('Access token must exist to fetch profile');
      }

      console.log('displaying profile');
      webAuth.client.userInfo(accessToken, function(err, profile) {
        if (profile) {
          userProfile = profile;
          verified = userProfile.email_verified;
          console.log(JSON.stringify(userProfile, undefined, 2));
          console.log(userProfile.email_verified);
          displayProfile();
        }
      });
    } else {
      displayProfile();
    }
  } //end getProfile

  function displayProfile() {
    document.querySelector('#profile-view .nickname').innerHTML =
      userProfile.nickname;
    document.querySelector(
      '#profile-view .full-profile'
    ).innerHTML = JSON.stringify(userProfile, null, 2);
    document.querySelector('#profile-view img').src = userProfile.picture;
  }//end displayProfile

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
  }//end handleAuthentication

  handleAuthentication();
});