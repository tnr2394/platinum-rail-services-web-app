var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fileSchema = new Schema({
    title :{
        type: String,
        unique : false,
        required : true
    },
    type:{
        type: String,
        required: true
    },
    path : {
        type: path,
        required : false
    },
    uploadedBy:{
        type: String
    },
    uploadedDate:{
        type: Date
    }
}, {
    timestamps: true
});
var fileModel = mongoose.model('file', fileSchema);
module.exports = fileModel;