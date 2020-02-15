const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const timeLogSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        in: {
            hours: {
                type: String,
                default: '-'
            },
            minutes: {
                type: String,
                default: '-'
            },
        },
        // Day Log Start Time
        lunchStart: {
            hours: {
                type: String,
                default: '-'
            },
            minutes: {
                type: String,
                default: '-'
            },
        },
        // Lunch Start Time
        lunchEnd: {
            hours: {
                type: String,
                default: '-'
            },
            minutes: {
                type: String,
                default: '-'
            },
        },
        // Lunch End Time
        out: {
            hours: {
                type: String,
                default: '-'
            },
            minutes: {
                type: String,
                default: '-'
            },
        },
        // Day log out time
    },
    travel: {
        hours:
        {
            type: String,
            default: '-'
        },
        minutes: {
            type: String,
            default: '-'
        }
    }
}, {
    timestamps: true
});

const timeLogModel = mongoose.model('timeLog', timeLogSchema);
module.exports = timeLogModel;