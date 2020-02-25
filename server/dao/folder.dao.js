var courseDAO = require('./course.dao');
const async = require("async");

const folderModel = require('../models/folder.model');
const fileDAO = require('../dao/file.dao');
const mailService = require('../services/mail.service');

const instructorController = require('../controllers/instructor.controller');
const clientController = require('../controllers/client.controller');

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
    fileDAO.addNewFile(obj).then((response) => {
        console.log('File added now update Folder', response._id);
        folderModel.updateOne({
            _id: folderId
        }, {
            $addToSet: {
                files: response._id
            },
        }, {
            new: true
        }, (err, updatedFolder) => {
            if (err) q.reject(err);
            else {
                q.resolve(response);
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

    folderModel.updateOne({
        _id: parentId
    }, {
        $push: {
            child: folderId
        }
    }, {
        new: true,
        upsert: true
    },
        (err, updatedFolder) => {
            if (err) q.reject(err);
            else {
                q.resolve(updatedFolder);
            }
        });
    return q.promise;
}

folder.removeFile = function (fileId) {
    console.log("delete file to folder DOA ", {
        fileId
    });
    var q = Q.defer();

    fileDAO.deleteFile(fileId)
        .then(updatedCourse => {
            console.log("Deleted from files. Now deleting from folder collection", updatedCourse);
            folderModel
                .updateOne({
                    files: {
                        $in: fileId._id
                    }
                }, {
                    $pull: {
                        files: fileId._id
                    }
                }, {
                    upsert: true,
                    new: true
                }, (err, updatedFolder) => {
                    if (err) return q.reject(err);
                    else {
                        console.log("folder Updated with new file Successfully =  ", updatedFolder);
                        return q.resolve(updatedFolder);
                    }
                });
        }, err => {
            console.error(err);
        }).catch(err => {
            console.error(err);
            return q.reject({
                msg: "No File found"
            });
        })
    return q.promise;
}

folder.updateParentFolder = function (parentId, childId) {
    console.log('Update Parent Folder::', parentId, childId);
    const q = Q.defer();
    folderModel
        .updateOne({
            _id: parentId
        }, {
            $pull: {
                child: childId
            }
        }, {
            upsert: true,
            new: true
        }, (err, updatedFolder) => {
            if (err) return q.reject(err);
            else {
                console.log("Removed Child From Parent Folder Successfully =  ", updatedFolder);
                return q.resolve(updatedFolder);
            }
        });
    return q.promise;
}

folder.updateSubFolder = function (folderId, childId) {
    console.log("Child Folder Push in Parent Successfully =  ", folderId, childId);
    const q = Q.defer();
    folderModel.updateOne({ _id: folderId }, { $push: { child: childId } }, {
        upsert: true, new: true
    }, (err, updatedFolder) => {
        if (err) return q.reject(err);
        else {
            folder.makeCurrentFolderChild(childId).then((response) => {
                console.log("Child Folder Push in Parent Successfully =  ", response);
                return q.resolve(response);
            }).catch((err) => {
                return q.reject(err);
            })
        }
    })
    return q.promise;
}

folder.makeCurrentFolderChild = function (folderId) {
    console.log("Child Folder Push in Parent Successfully =  ", folderId);
    const q = Q.defer();
    folderModel.updateOne({ _id: folderId }, { $set: { 'isChild': true } }, {
        upsert: true, new: true
    }, (err, updatedFolder) => {
        if (err) return q.reject(err);
        else {
            console.log("Make Child Successfully =  ", updatedFolder);
            return q.resolve(updatedFolder);
        }
    })
    return q.promise;
}

folder.sendShareFolderMail = (userList, folderDetail) => {
    return new Promise((resolve, reject) => {
        console.log('Inside Send Mail Folder Share', userList, folderDetail);

        // return;

        const defaultPasswordEmailoptions = {
            to: userList,
            subject: folderDetail.title + `- Invitation to view`,
            template: 'share-folder'
        };

        mailService.sendMail(defaultPasswordEmailoptions, folderDetail, null, function (err, mailResult) {
            if (err) {
                reject(err)
            } else {
                resolve(mailResult)
            }
        });
    })
}


folder.sendShareFileMail = (userList, fileDetail) => {
    return new Promise((resolve, reject) => {
        console.log('Inside Send Mail File Share', userList, fileDetail);
        const defaultPasswordEmailoptions = {
            to: userList,
            subject: 'Shared File',
            template: 'share-file'
        };
        mailService.sendMail(defaultPasswordEmailoptions, fileDetail, null, function (err, mailResult) {
            if (err) {
                reject(err)
            } else {
                resolve(mailResult)
            }
        });
    });
}




module.exports = folder;