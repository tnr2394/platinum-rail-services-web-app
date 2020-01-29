const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    materials: [{
        type: Schema.Types.ObjectId,
        ref: 'material'
    }]
}, {
        timestamps: true
    });
const courseModel = mongoose.model('course', courseSchema);


module.exports = courseModel;

