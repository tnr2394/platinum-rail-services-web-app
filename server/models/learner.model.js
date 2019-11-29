var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var learnerSchema = new Schema({
    name:{
        type: String
    },
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
        ref: 'job',
        required: true
    },
    allotments: [{
        assignment:{
            type: Schema.Types.ObjectId,
            
        },
    }],
    
}, {
    timestamps: true
});
var learnerModel = mongoose.model('learner', learnerSchema);
module.exports = learnerModel;

