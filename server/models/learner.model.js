var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var learnerSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    job:{
        type: Schema.Types.ObjectId,
        ref: 'job'
    },
    allotments: [{
        assignment:{
            type: Schema.Types.ObjectId,
            
        }
    }],
    assignments:[new Schema({
        assignment: {
            type: Schema.Types.ObjectId,
            ref: 'assignment'
        },
        title:{
            type: String
        },
        status,
        submission:{
            type: Schema.Types.ObjectId,
            ref: 'submission'
        }
    })]
}, {
    timestamps: true
});
var learnerModel = mongoose.model('learner', learnerSchema);
module.exports = learnerModel;

