var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var submissionSchema = new Schema({
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'file'
    }],
    remark:{
        type: String
    }
}, {
    timestamps: true
});
var submissionModel = mongoose.model('learner', submissionSchema);
module.exports = submissionModel;

