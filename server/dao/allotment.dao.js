// Npm Modules
const Q = require('q');

const allotmentModel = require('../models/allotment.model');
const mailService = require('../services/mail.service');
var allotment = {};

allotment.createAllotment = function (obj) {
    const q = Q.defer();
    const newAllotment = new allotmentModel(obj);

    newAllotment.save((err, newAllotment) => {
        if (err) {
            console.log('Err', err);
            return q.reject(err);
        } else {
            console.log("newAllotment Added Successfully =  ", newAllotment);
            return q.resolve(newAllotment);
        }
    });
    return q.promise;
}

allotment.updateAllotment = function (object) {
    console.log("Update Allotemnt in allotemnt DAO", object);
    var q = Q.defer();
    var updatedAllotment = object;
    allotmentModel.findByIdAndUpdate(object._id, updatedAllotment, { new: true }, (err, allotment) => {
        if (err) return q.reject(err);
        else {
            console.log("Allotment Updated Successfully =  ", allotment, q);
            return q.resolve(allotment);
        }
    });
    return q.promise;
}


allotment.deleteAllotment = function (allotemntId) {
    console.log("Delete allotment");
    var q = Q.defer();

    console.log("Allotment to be deleted : ", allotemntId);
    learnerModel.deleteOne({ _id: allotemntId }, (err, deleted) => {
        if (err) q.reject(err);
        console.log("Deleted ", deleted);
        q.resolve(deleted);
    });
    return q.promise;
}

module.exports = allotment;


