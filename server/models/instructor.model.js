var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var instructorSchema = new Schema({
    name :{
        type: String,
        unique : false,
        required : true
    },
    email : {
        type: String,
        unique : false,
        required : true
    },
    password:{
        type: String,
        required: true
    },
    dateOfJoining:{
        type: Date,
        required: true
    },
    qualifications:[{
        title: {
            type: String
        },
        validUntil: {
            type: Date
        }
    }]
}, {
    timestamps: true
});
var instructorModel = mongoose.model('instructor', instructorSchema);
module.exports = instructorModel;