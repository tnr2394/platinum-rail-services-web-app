var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var materialSchema = new Schema({
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'file'
    }],
    title:{
        type: String
    },
    type:{
        type: String
    },
    unitNo:{
        type: Number
    },
    assignmentNo: {
        type: Number
    },
    course:{
        type: Schema.Types.ObjectId,
        ref: 'course'
    }
}, {
    timestamps: true
});
var materialModel = mongoose.model('material', materialSchema);
module.exports = materialModel;

