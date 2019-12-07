var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var courseSchema = new Schema({
    title :{
        type: String,
        unique : false,
        required : true
    },
    duration : {
        type: Number,
        unique : false,
        required : true
    },
    materials:[{
        type: Schema.Types.ObjectId,
        ref: 'material'
    }]
}, {
    timestamps: true
});
var courseModel = mongoose.model('course', courseSchema);
module.exports = courseModel;