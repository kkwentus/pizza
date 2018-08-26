//setup the express webserver
const express = require('express');
const port = process.env.PORT || 3000;

var app = express();
var path = require('path');

app.use(express.static(__dirname));

//parser for json format
var bodyParser = require('body-parser')
app.use(bodyParser.json());

//set up DB connection
var mongoose = require('mongoose');
const {ObjectId} = require('mongodb');
var {custProfile} = require('./custprofile');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/STLProvel');

//post a single profile
app.post('/profiles', (request, response) => {
      console.log(request.body);
      var profile = new custProfile({
          username: request.body.username,
          email: request.body.email
      })

      profile.save().then((doc) => {
          response.status(200).send(doc)

      }, (error) => {
          response.status(400).send(error);
      });
});

//get all profiles
app.get('/profiles', (request, response) => {
    custProfile.find().then((profiles) => {
        response.send({profiles});

    }, (error) => {
        response.status(400).send(error);
    });
});

//get by specific DB _ID
app.get('/profiles/:id', (request, response) => {
    var id = request.params.id;
    if(ObjectId.isValid(request.params.id))
    {
        custProfile.findById(request.params.id).then((profile) => {
          response.status(200).send;
          response.send({profile});

         }, (error) => {
             response.status(400).send(error);
            console.log('unable to fetch profile');
        })

    } else {
        console.log('invalid id');
        response.status(400).send('invalid id');
    }
d
});

app.get('/', function(request, response) {
    console.log ('HTML INCOMING');
    response.sendFile(path.join(__dirname + '/index.html'));
});


//start the webserver
app.listen(port, ()=> {
    console.log(`Pizza baking on port ${port}`);
});


