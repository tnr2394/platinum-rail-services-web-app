var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var folderSchema = new Schema({
    title: {
        type: String
    },
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'file'
    }],
    createdBy: {
        type: String
    }
}, {
        timestamps: true
    });
var folderModel = mongoose.model('folder', folderSchema);
module.exports = folderModel;

