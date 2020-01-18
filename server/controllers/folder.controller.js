// Npm Modules

const Q = require('q');
const async = require("async");

// Static Variables

const folderController = {};
const folderDOA = require('../dao/folder.dao');

const folderModel = require('../models/folder.model');

async function allfolders(query) {
    var deferred = Q.defer();

    folderModel.find(query)
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


module.exports = folderController;