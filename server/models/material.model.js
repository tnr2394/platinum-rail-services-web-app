const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const materialSchema = new Schema({
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'file'
    }],
    title: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    unitNo: {
        type: Number
    },
    assignmentNo: {
        type: Number
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course',
        require: true
    }
}, {
        timestamps: true
    });
const materialModel = mongoose.model('material', materialSchema);
module.exports = materialModel;

