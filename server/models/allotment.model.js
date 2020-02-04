const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const allotmentSchema = new Schema({
    assignment: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'material'
    },
    learner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'learner'
    },
    status: {
        type: String,
        default: 'Pending',
    },
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'file'
    }],
    remark: {
        type: String
    },
    deadlineDate: {
        type: Date,
        required: true
    },
}, {
        timestamps: true
    });
const allotmentModel = mongoose.model('allotment', allotmentSchema);
module.exports = allotmentModel;
