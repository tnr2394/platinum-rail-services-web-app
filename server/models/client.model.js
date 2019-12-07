var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var clientSchema = new Schema({
    name :{
        type: String,
        unique : false,
        required : true
    },
    locations : [{
        type: Schema.Types.ObjectId,
        ref: 'location'
    }],
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
var clientModel = mongoose.model('client', clientSchema);
module.exports = clientModel;