const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new Schema({
    title: {
        type: String
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'client',
        required: true
    }
});

const locationModel = mongoose.model('location', locationSchema);
module.exports = locationModel;