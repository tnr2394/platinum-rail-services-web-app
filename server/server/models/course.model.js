var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var courseSchema = new Schema({
    title: {
        type: String,
        unique: false,
        required: true
    },
    duration: {
        type: Number,
        unique: false,
        required: true
    },
    materials: [{
        type: Schema.Types.ObjectId,
        ref: 'material'
    }]
}, {
        timestamps: true
    });
var courseModel = mongoose.model('course', courseSchema);

// courseSchema.pre('remove', { query: true }, function () {
//     console.log('Removing From Pre Function!');
// });

// courseSchema.pre('remove', { document: true }, function () {
//     console.log('Removing doc!');
// });

// courseSchema.pre('deleteOne', function (next) {
//     console.log('Removing From Pre Function!');
// });

courseSchema.pre("remove", { query: true }, function (next) {
    // let id = this.getQuery()["_id"];
    // mongoose.model("Model_two").deleteMany({ property: id }, function (err, result) {
    //     if (err) {
    //         next(err);
    //     } else {
    //         next();
    //     }
    // });

    console.log('Removing From Pre Function!');
});


module.exports = courseModel;

