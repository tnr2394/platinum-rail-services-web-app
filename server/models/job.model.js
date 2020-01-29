const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'location',
        required: true
    },
    instructors: [{
        type: Schema.Types.ObjectId,
        ref: 'instructor',
        required: true
    }],
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    startingDate: {
        type: String,
        required: true
    },
    totalDays: [{
        type: String,
        required: true
    }],
    singleJobDate: [{
        type: String
    }]
})

const jobModel = mongoose.model('job', jobSchema);
module.exports = jobModel;