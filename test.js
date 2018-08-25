var QSTester = require("auth0-quickstarts-tester");

//Change the values below to match an existing database user on the Test Client
var testParameters = {
    url: "https://guarded-oasis-19017.herokuapp.com/",
    user: "email@test.com",
    password: "testpwd"
  };
new QSTester().runOnPath(".", testParameters)
  .then(() => process.exit());