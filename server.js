//setup the express webserver
const express = require('express');
const port = process.env.PORT || 3000;
const bparser = require('body-parser');

var app = express();
var path = require('path');

//setup mongodb
var {mongoose} = require('./mongoose');
var {pizzaOrder} = require('./pizzaOrder');

app.use(express.static(__dirname));

//parser for json format
app.use(bparser.json());

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});


app.post('/order', (request, response) => {
    console.log('adding pizza order record', request.body);

        var pizza = new pizzaOrder({
            userid: request.body.userid,
            gender: request.body.gender,
            googlecount: request.body.count,
            email: request.body.email 
        });

        pizza.save().then((doc) =>{
            console.log('Pizza order has been logged');
            response.status(200).send;
            response.send(doc);

        }, (error) =>{
            response.status(400).send(error);
            console.log('unable to create the pizza order');
    });

});


//start the webserver
app.listen(port, ()=> {
    console.log(`Pizza 42 running on port ${port}`);
});