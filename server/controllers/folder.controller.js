// Npm Modules

const Q = require('q');
const async = require("async");

// Static Variables

const folderController = {};
const folderDOA = require('../dao/folder.dao');

const folderModel = require('../models/folder.model');
const instructorModel = require('../models/instructor.model');
const clientModel = require('../models/client.model');

async function allfolders(query) {
    var deferred = Q.defer();

    folderModel.find(query)
        .populate('files')
        .exec((err, folders) => {
            if (err) deferred.reject(err);
            console.log("RETRIVED DATA = ", folders);
            deferred.resolve(folders);
        });
    return deferred.promise;

}

folderController.getFolders = async function (req, res, next) {
    var query = {};
    if (req.query) {
        query = req.query;
    }
    console.log("GET FOLDER query = ", query);
    allfolders(query).then(folders => {
        console.log("SENDING RESPONSE Folders = ", folders)
        return res.send({ data: { folders } });
    })
}



folderController.createFolder = async function (req, res, next) {
    console.log("Add Folder", req.body);

    var newFolder = {
        title: req.body.title,
        createdBy: req.user._id,
    };

    folderDOA.createFolder(newFolder)
        .then(newFolderRes => {
            console.log("New Folder Controller", newFolderRes);
            return res.send({ data: { newFolderRes } })
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send({ err });
        })
}

folderController.deleteFolder = function (req, res, next) {
    const folderId = req.query._id;

    folderModel.remove({ _id: folderId }, (err, deleted) => {
        if (err) {
            return res.status(500).send({ err })
        }
        console.log("Deleted ", deleted);
        return res.send({ data: {}, msg: "Folder Deleted Successfully" });
    })
}

/**
 * Add File Inside Folder
 */
folderController.addFile = function (req, res, next) {
    console.log("Update Folder", req.body, req.files);

    let files = [];

    if (Array.isArray(req.files.file)) {
        files = req.files.file
    } else {
        files[0] = req.files.file;
    }

    async.eachSeries(files, (singleFile, innerCallback) => {
        console.log('singleFile', singleFile);

        const folderId = req.body.folderId;

        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(singleFile.name)[1];
        var name = singleFile.name.split('.').slice(0, -1).join('.')

        var newName = name + '-' + Date.now();

        var newFile = {
            title: newName,
            type: "material",// OR SUBMISSION OR DOCUMENT
            path: "NEWPATH",
            extension: ext,
            uploadedBy: 'ADMIN',
            file: singleFile,
            uploadedDate: new Date()
        }

        console.log('new file object', newFile, folderId);

        folderDOA.uploadFileToFolder(folderId, newFile)
            .then(updated => {
                console.log("updated ", updated);
                innerCallback();
            }, err => {
                return res.status(500).send({ err })
            })
    }, (callbackError, callbackResponse) => {
        if (callbackError) {
            console.log("callbackError ", callbackError);
            return res.status(500).send({ err })
        } else {
            return res.send({ data: {}, msg: "File Uploaded Successfully" });
        }
    })
}


folderController.updateFolder = function (req, res, next) {
    console.log("Update Folder", req.body);

    var updateFolder = {};

    if (req.body.title) updateFolder['title'] = req.body.title;


    folderModel.findOneAndUpdate({ _id: req.body._id }, { $set: updateFolder }, { new: true }, (err, folder) => {
        console.log("Updated folder", folder, err);
        if (err) {
            return res.status(500).send({ err })
        }
        return res.send({ data: { folder } });
    })
}



folderController.shareFolder = function (req, res, next) {
    console.log("Sharing Folder", req.body.file);
    const sharedFolder = req.body.file;
    const instructorList = req.body.selectedInstructors;
    const clientList = req.body.selectedClients;

    if (req.body.selectedInstructors && req.body.selectedClients) {
        Promise.all([
            shareFolderToInstructor(sharedFolder, instructorList),
            shareFolderToClient(sharedFolder, clientList)
        ]).then((success) => {
            return res.send({ data: { success } });
        }).catch((reason) => {
            return res.status(500).send({ reason })
        })
    } else if (req.body.selectedInstructors) {
        shareFolderToInstructor(sharedFolder, instructorList).then((res) => {

        }).catch((error) => {

        })
    } else if (req.body.selectedClients) {
        shareFolderToClient(sharedFolder, clientList).then((res) => {

        }).catch((error) => {
            return res.status(500).send({ error })
        })
    }
}

const shareFolderToInstructor = (folder, instructors) => {
    console.log('Inside Instructor');
    return new Promise((resolve, reject) => {
        async.eachSeries(instructors, (singleIns, innerCallback) => {
            instructorModel.findOneAndUpdate({ _id: singleIns._id }, { $addToSet: { sharedFolder: folder._id } }, { new: true }, (err, updatedMaterial) => {
                if (err) {
                    reject(err);
                } else {
                    innerCallback();
                }
            });
        }, (callbackError, callbackResponse) => {
            if (callbackError) {
                console.log("callbackError ", callbackError);
                reject(callbackError);
            } else {
                resolve(callbackResponse);
            }
        })
    })
}

const shareFolderToClient = (folder, clients) => {
    console.log('Inside Instructor');
    return new Promise((resolve, reject) => {
        async.eachSeries(clients, (singleClient, innerCallback) => {
            clientModel.findOneAndUpdate({ _id: singleClient._id }, { $addToSet: { sharedFolder: folder._id } }, { new: true }, (err, updatedMaterial) => {
                if (err) {
                    reject(err);
                } else {
                    innerCallback();
                }
            });
        }, (callbackError, callbackResponse) => {
            if (callbackError) {
                console.log("callbackError ", callbackError);
                reject(callbackError);
            } else {
                resolve(callbackResponse);
            }
        })
    })
}


module.exports = folderController;