const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const competenciesSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'file'
    }],
    expiryDate: {
        type: Date,
        require: true
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'instructor',
        require: true
    }
}, {
    timestamps: true
});
const competenciesModel = mongoose.model('competencies', competenciesSchema);
module.exports = competenciesModel;

