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
    isChild: {
        type: Boolean,
        default: false,
    },
    nameSlug: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'folder'
    },
    child: [{
        type: Schema.Types.ObjectId,
        ref: 'folder'
    }],
    sharedInstructor: [{
        type: Schema.Types.ObjectId,
        ref: 'instructor'
    }],
    sharedClient: [{
        type: Schema.Types.ObjectId,
        ref: 'client'
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

