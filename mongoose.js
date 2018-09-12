var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//use the URL set by mongodb in heroku, else use local
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza42');

module.exports = {
    mongoose
};