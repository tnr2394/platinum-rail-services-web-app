const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const folderSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'file'
    }],
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'folder'
    },
    child: [{
        type: Schema.Types.ObjectId,
        ref: 'folder'
    }],
    createdBy: {
        type: String,
        required: true
    }
}, {
        timestamps: true
    });
const folderModel = mongoose.model('folder', folderSchema);
module.exports = folderModel;

