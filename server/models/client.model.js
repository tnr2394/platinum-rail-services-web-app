const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const clientSchema = new Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    locations: [{
        type: Schema.Types.ObjectId,
        ref: 'location'
    }],
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sharedFile: {
        type: Schema.Types.ObjectId,
        ref: 'file'
    },
    sharedFolder: {
        type: Schema.Types.ObjectId,
        ref: 'file'
    }
}, {
        timestamps: true
    });
const clientModel = mongoose.model('client', clientSchema);
module.exports = clientModel;