const express = require('express');

const port = process.env.PORT || 3000;

var app = express();

app.use(express.static(__dirname + '/public'));


app.get('/', (request, response) => {
   // response.send('<h2>PizzaPizza!</h2>');
    response.send({
        size: 'large',
        toppings: [
            'pepperoni', 
            'provel', 
            'mushrooms']
    })
});

app.listen(port, ()=> {
    console.log(`Pizza baking on port ${port}`);
});
