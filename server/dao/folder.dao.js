var courseDAO = require('./course.dao');
var fileDAO = require('./file.dao');

const folderModel = require('../models/folder.model');

var Q = require('q');

var folder = {};

// Create new folder

folder.createFolder = function (obj) {
    var q = Q.defer();
    var newFolder = new folderModel(obj);
    newFolder.save((err, newFolder) => {
        if (err) return q.reject(err);
        console.log("New Folder Created Successfully =  ", newFolder);
        if (obj.parent) {
            folder.updateChildFolder(obj.parent, newFolder).then((response) => {
                return q.resolve(newFolder);
            }).catch((error) => {
                q.reject(error);
            })
        }
        return q.resolve(newFolder);
    });
    return q.promise;
}

// Upload File inside folder

folder.uploadFileToFolder = function (folderId, obj) {
    console.log('File Upload', folderId, obj);
    var q = Q.defer();
    fileDAO.addFile(obj).then((response) => {
        console.log('File added now update Folder', response._id);
        folderModel.updateOne({ _id: folderId }, { $addToSet: { files: response._id }, }, { new: true }, (err, updatedFolder) => {
            if (err) q.reject(err);
            else {
                q.resolve(updatedFolder);
            }
        });
    }).catch((error) => {
        q.reject(error);
    });
    return q.promise;
}

// Update Child of parent folder
folder.updateChildFolder = function (parentId, folderId, obj) {
    console.log('File Upload', folderId, obj);
    var q = Q.defer();

    folderModel.updateOne(
        { _id: parentId },
        { $push: { child: folderId } },
        { new: true, upsert: true },
        (err, updatedFolder) => {
            if (err) q.reject(err);
            else {
                q.resolve(updatedFolder);
            }
        });
    return q.promise;
}



module.exports = folder;