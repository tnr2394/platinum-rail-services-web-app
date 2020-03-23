var path = require('path');

var mongoose = require('mongoose');

var config = {
    url: '127.0.0.1',
    port: '27017',
    name: 'platinumDev'
}

let options = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30,
    useUnifiedTopology: true,
    autoIndex: false, // Don't build indexes
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    useNewUrlParser: true
}


mongoose.connect('mongodb://' + config.url + ':' + config.port + '/' + config.name, options);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to database [' + config.name + '] on ' + config.url + ":" + config.port + ".");
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected from database [' + config.name + '] on ' + config.url + ":" + config.port + ".");
});

mongoose.connection.on('error', function (err) {
    console.log("Connection error: " + err);
});

module.exports = config;