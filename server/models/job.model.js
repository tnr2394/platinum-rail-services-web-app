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
        type: String
    },
    location: { 
        type: String 
    },
    instructor: [{ 
        type: String 
    }],
    course: { 
        type:String 
    },
    startingDate: { 
        type: Date 
    },
    frequency: { 
        type: Number 
    },
    singleJobDate: [{ 
        type:Date 
    }]
})
var jobModel = mongoose.model('job', jobSchema);
module.exports = jobModel;