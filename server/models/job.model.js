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
    instructor: { 
        type: Array
    },
    course: { 
        type:String 
    },
    startingDate: { 
        type: String 
    },
    frequency: [{ 
        type: String 
    }],
    singleJobDate: [{ 
        type:String
    }]
})

var jobModel = mongoose.model('job', jobSchema);
module.exports = jobModel;