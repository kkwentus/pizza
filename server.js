//setup the express webserver
const express = require('express');
const port = process.env.PORT || 3000;

var app = express();
var path = require('path');

app.use(express.static(__dirname));

//parser for json format
var bodyParser = require('body-parser')
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});

//start the webserver
app.listen(port, ()=> {
    console.log(`Pizza 42 running on port ${port}`);
});


