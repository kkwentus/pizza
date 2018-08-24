//setup the webserver
const express = require('express');
const port = process.env.PORT || 3000;

var bodyParser = require('body-parser')

var app = express();
app.use(express.static(__dirname + '/public'));

//set up DB connection
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/STLProvel');

//create the DB model
var custProfile = mongoose.model('custProfile', {
    username: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    }
});

app.use(bodyParser.json());

app.post('/profiles', (request, response) => {
      console.log(request.body);
      var profile = new custProfile({
          username: request.body.username,
          gender: request.body.gender
      })

      profile.save().then((doc) => {
          response.status(200).send(doc)

      }, (error) => {
          response.status(400).send(error);
      });
});

app.get('/profiles', (request, response) => {
    custProfile.find().then((profiles) => {
        response.send({profiles});

    }, (error) => {
        response.status(400).send(error);
    });
});

app.listen(port, ()=> {
    console.log(`Pizza baking on port ${port}`);
});