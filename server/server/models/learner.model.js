var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var learnerSchema = new Schema({
    name: {
        type: String
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
}, {
        timestamps: true
    });
var learnerModel = mongoose.model('learner', learnerSchema);
module.exports = learnerModel;

