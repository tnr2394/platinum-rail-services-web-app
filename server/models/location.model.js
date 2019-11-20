var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var locationSchema = new Schema({
    title: {
        type: String
    },
    client:{
        type: Schema.Types.ObjectId,
        ref: 'client'
    }
});

var locationModel = mongoose.model('location', locationSchema);
module.exports = locationModel;