var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var instructorSchema = new Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    email: {
        type: String,
        unique: false,
        required: true
    },
    mobile: {
        type: String,
        unique: true
    },
    profilePic: {
        type: Schema.Types.ObjectId,
        ref: 'file'
    },
    password: {
        type: String,
        required: true
    },
    dateOfJoining: {
        type: Date,
        required: true
    },
    qualificationTitle: {
        type: String
    },
    validUntil: {
        type: Date
    },
    competencies: {
        type: Array
    },
    file: {
        type: Schema.Types.ObjectId,
        ref: 'file'
    },
    sharedFile: {
        type: Schema.Types.ObjectId,
        ref: 'file'
    },
    sharedFolder: {
        type: Schema.Types.ObjectId,
        ref: 'file'
    }
}, {
        timestamps: true
    });
var instructorModel = mongoose.model('instructor', instructorSchema);
module.exports = instructorModel;