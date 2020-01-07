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
    contact: {
        type: Number,
        unique: true
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
    file: {
        type: Schema.Types.ObjectId,
        ref: 'file'
    }
}, {
        timestamps: true
    });
var instructorModel = mongoose.model('instructor', instructorSchema);
module.exports = instructorModel;