var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jobSchema = new Schema({
    title: { 
        type: String, 
        required: true
    },
    color: { 
        type: String, 
        required: true 
    },
    client: { 
        type: Schema.Types.ObjectId,
        ref: 'client'
    },
    location: { 
        type: Schema.Types.ObjectId,
        ref: 'location' 
    },
    instructor: { 
        type: Array
    },
    course: { 
        type:Array 
    },
    startingDate: { 
        type: String 
    },
    totalDays: [{ 
        type: String 
    }],
    singleJobDate: [{ 
        type:String
    }]
})

var jobModel = mongoose.model('job', jobSchema);
module.exports = jobModel;