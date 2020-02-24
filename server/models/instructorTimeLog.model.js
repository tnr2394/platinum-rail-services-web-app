const mongoose = require('mongoose')
const Schema = mongoose.Schema

const instructorTimeLogSchema = new Schema({
    instructorId : {
        type: Schema.Types.ObjectId,
        ref: 'instructor'
    },
    logs:[{
        type: Schema.Types.ObjectId,
        ref: 'timeLog'
    }]
}, {
    timestamps: true
})


const instructorTimeLogModel = mongoose.model('instructorTimeLog', instructorTimeLogSchema)
module.exports = instructorTimeLogModel