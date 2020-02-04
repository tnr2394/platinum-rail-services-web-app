import { type } from "os"

course:{
    _id,
    title,
    duration
};
job:{
    _id,
    courseId,
    instructors[],
    clientId,
    locationId,
    startingDate,
    dates[],
    learners[],
    frequency[mon,tue,wed,thu,fri,sat]

};
instructor:{
    _id,
    jobStartDate,
    email,
    password
};
learner:{
    _id,
    email,
    password,
    jobId,
    allotment:[{
        assignment_id,
        status,
        file,
        remark,
    }],
    assignments:[{
        _id,
        title,
        status,
        file,
        remark,
        lastUpdated
    }]
};
material:{
    _id,
    type,
    title
};
// subission:{
//     _id,
//     learnerId,
//     materialId,
//     jobId,
//     file,
//     remark
// }
files:{
    _id,
    name,
    extension,
    uploadedBy,
    uploadDate
};
client:{
    _id,
    name,
    locations[]
};
location:{
    _id,
    clientId,
    name
};