const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// const timeLogSchema = new Schema({
//     date: {
//         type: Date,
//         required: true
//     },
//     time: {
//         in: {
//             hours: {
//                 type: String,
//                 default: '-'
//             },
//             minutes: {
//                 type: String,
//                 default: '-'
//             },
//         },
//         // Day Log Start Time
//         lunchStart: {
//             hours: {
//                 type: String,
//                 default: '-'
//             },
//             minutes: {
//                 type: String,
//                 default: '-'
//             },
//         },
//         // Lunch Start Time
//         lunchEnd: {
//             hours: {
//                 type: String,
//                 default: '-'
//             },
//             minutes: {
//                 type: String,
//                 default: '-'
//             },
//         },
//         // Lunch End Time
//         out: {
//             hours: {
//                 type: String,
//                 default: '-'
//             },
//             minutes: {
//                 type: String,
//                 default: '-'
//             },
//         },
//         // Day log out time
//     },
//     travel: {
//         hours:
//         {
//             type: String,
//             default: '-'
//         },
//         minutes: {
//             type: String,
//             default: '-'
//         }
//     }
// }, {
//     timestamps: true
// });



const timeLogSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    logIn: {
        type: String,
        default: '00:00'
    },
    lunchStart: {
        type: String,
        default: '00:00'
    },
    lunchEnd: {
        type: String,
        default: '00:00'
    },
    logOut: {
        type: String,
        default: '00:00'
    },
    workingHours: {
        hours: {
            type: Number,
            default: 0
        },
        minutes: {
            type: Number,
            default: 0
        }
    },
    totalHours: {
        hours: {
            type: Number,
            default: 0
        },
        minutes: {
            type: Number,
            default: 0
        }
    },
    travel: {
        type: String,
        default: '00:00'
    }
}, {
    timestamps: true
});



const timeLogModel = mongoose.model('timeLog', timeLogSchema);
module.exports = timeLogModel;