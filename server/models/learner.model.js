const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const learnerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
    },
    profilePic: {
        type: Schema.Types.ObjectId,
        ref: 'file'
    },
    password: {
        type: String,
        required: true
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'job',
        required: true
    },
    allotments: [{
        type: Schema.Types.ObjectId,
        ref: 'allotment'
    }],
    exam1: {
        type: Number,
        default: 0
    },
    exam2: {
        type: Number,
        default: 0
    }
}, {
        timestamps: true
    });
const learnerModel = mongoose.model('learner', learnerSchema);
module.exports = learnerModel;

