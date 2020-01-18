var courseDAO = require('./course.dao');
var fileDAO = require('./file.dao');

const folderModel = require('../models/folder.model');

var Q = require('q');

var folder = {};

folder.createFolder = function (obj) {
    var q = Q.defer();
    var newFolder = new folderModel(obj);

    newFolder.save((err, newFolder) => {
        if (err) return q.reject(err);
        console.log("New Folder Created Successfully =  ", newFolder);
        return q.resolve(newFolder);
    });
    return q.promise;
}


module.exports = folder;