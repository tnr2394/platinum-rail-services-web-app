const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fileSchema = new Schema({
    title: {
        type: String,
        unique: false,
        required: true
    },
    alias: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
        // Material,Submission
    },
    path: {
        type: String,
        required: false
    },
    extension: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: String
    },
    uploadedDate: {
        type: Date
    },
    sharedInstructor: [{
        type: Schema.Types.ObjectId,
        ref: 'instructor'
    }],
    sharedClient: [{
        type: Schema.Types.ObjectId,
        ref: 'client'
    }],
}, {
    timestamps: true
});
const fileModel = mongoose.model('file', fileSchema);
module.exports = fileModel;