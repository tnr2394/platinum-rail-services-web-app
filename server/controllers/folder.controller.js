// Npm Modules

const Q = require('q');
const async = require("async");
const lodash = require('lodash');
const ObjectId = require('mongodb').ObjectId;

// Static Variables

const folderController = {};
const folderDOA = require('../dao/folder.dao');

const folderModel = require('../models/folder.model');
const fileModel = require('../models/file.model');
const instructorModel = require('../models/instructor.model');
const clientModel = require('../models/client.model');

async function allfolders(query) {
    var deferred = Q.defer();

    folderModel.find(query)
        .populate('files')
        .populate('child')
        .populate('sharedClient')
        .populate('sharedInstructor')
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

    let filesArray = [];

    if (Array.isArray(req.files.file)) {
        files = req.files.file
    } else {
        files[0] = req.files.file;
    }

    async.eachSeries(files, (singleFile, innerCallback) => {
        console.log('singleFile', singleFile);

        const folderId = req.body.folderId;

        let re = /(?:\.([^.]+))?$/;
        let ext = re.exec(singleFile.name)[1];
        let name = singleFile.name.split('.').slice(0, -1).join('.')

        let newName = name + '-' + Date.now();

        let newFile = {
            title: newName,
            type: "file",// OR SUBMISSION OR DOCUMENT
            path: "NEWPATH",
            extension: ext,
            uploadedBy: req.user.name,
            file: singleFile,
            uploadedDate: new Date()
        }

        console.log('new file object', newFile, folderId);

        folderDOA.uploadFileToFolder(folderId, newFile)
            .then(updated => {
                console.log("updated ", updated);
                filesArray.push(updated);
                innerCallback();
            }, err => {
                return res.status(500).send({ err })
            })
    }, (callbackError, callbackResponse) => {
        if (callbackError) {
            console.log("callbackError ", callbackError);
            return res.status(500).send({ err })
        } else {
            console.log('Files Array::::::::', filesArray);
            return res.send({ data: { file: filesArray }, msg: "File Uploaded Successfully" });
        }
    })
}

// Update folder details

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
    let instructorList = [];
    let clientList = [];

    if (req.body.selectedInstructors) {
        lodash.forEach(req.body.selectedInstructors, function (singleIns) {
            instructorList.push(singleIns._id);
        })
    }

    if (req.body.selectedClients) {
        lodash.forEach(req.body.selectedClients, function (singleClient) {
            clientList.push(singleClient._id);
        })
    }

    sharingFolder(sharedFolder, instructorList, clientList).then((folder) => {
        return res.send({ data: { folder } });
    }).catch((error) => {
        return res.status(500).send({ error })
    })
}

const sharingFolder = (folder, instructors, clients) => {
    return new Promise((resolve, reject) => {
        folderModel.updateOne(
            { _id: folder },
            {
                $set:
                {
                    sharedInstructor: instructors, sharedClient: clients
                }
            }, { new: true, upsert: true }, (err, updatedFolder) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(updatedFolder);
                }
            });
    })
}

folderController.shareFile = function (req, res, next) {
    console.log("Sharing File:::::::", req.body.file);
    const sharedFolder = req.body.file;
    let instructorList = [];
    let clientList = [];

    if (req.body.selectedInstructors) {
        lodash.forEach(req.body.selectedInstructors, function (singleIns) {
            instructorList.push(singleIns._id);
        })
    }

    if (req.body.selectedClients) {
        lodash.forEach(req.body.selectedClients, function (singleClient) {
            clientList.push(singleClient._id);
        })
    }

    sharingFile(sharedFolder, instructorList, clientList).then((file) => {
        return res.send({ data: { file } });
    }).catch((error) => {
        return res.status(500).send({ error })
    })
}

const sharingFile = (file, instructors, clients) => {
    return new Promise((resolve, reject) => {
        fileModel.updateOne(
            { _id: file },
            {
                $set:
                {
                    sharedInstructor: instructors, sharedClient: clients
                }
            }, { new: true, upsert: true }, (err, updatedFile) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(updatedFile);
                }
            });
    })
}


folderController.getSharedFolder = function (req, res, next) {

    let query = {
        $and: []
    }

    if (req.user.userRole == 'instructor') {
        query = { 'sharedInstructor': ObjectId(req.user._id) }
    } else if (req.user.userRole == 'client') {
        query = { 'sharedClient': ObjectId(req.user._id) }
    }


    allfolders(query).then(folders => {
        console.log("SENDING RESPONSE Folders = ", folders)
        return res.send({ data: { folders } });
    })



    // return new Promise((resolve, reject) => {
    //     console.log('Get Shared Folder::::::::', req.user);

    //     let query = {
    //         $and: []
    //     }

    //     if (req.user.userRole == 'instructor') {
    //         query['$and'].push({ 'sharedInstructor': ObjectId(req.user._id) })
    //     } else if (req.user.userRole == 'client') {
    //         query['$and'].push({ 'sharedClient': ObjectId(req.user._id) })
    //     }


    //     folderModel.aggregate([
    //         {
    //             $match: query
    //         },
    //         {

    //         }
    //     ]).exec((err, folders) => {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             return res.send({ data: { folders } });
    //         }
    //     });
    // })
}


folderController.getSharedFile = function (req, res, next) {

    return new Promise((resolve, reject) => {
        console.log('Get Shared Files::::::::', req.user);

        let query = {
            $and: []
        }

        if (req.user.userRole == 'instructor') {
            query['$and'].push({ 'sharedInstructor': ObjectId(req.user._id) })
        } else if (req.user.userRole == 'client') {
            query['$and'].push({ 'sharedClient': ObjectId(req.user._id) })
        }

        fileModel.aggregate([
            {
                $match: query
            },
        ]).exec((err, files) => {
            if (err) {
                reject(err);
            } else {
                return res.send({ data: { files } });
            }
        });
    })
}




module.exports = folderController;