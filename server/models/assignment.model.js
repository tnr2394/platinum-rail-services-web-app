var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var assignmentSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    course:{
        type: Schema.Types.ObjectId,
        ref: 'course'
    },
    submission: new Schema({
        file: {
            type: Schema.Types.ObjectId,
            ref: 'file'
        },
        remark,
        lastUpdated
    })
}, {
    timestamps: true
});
var learnerModel = mongoose.model('learner', assignmentSchema);
module.exports = learnerModel;

