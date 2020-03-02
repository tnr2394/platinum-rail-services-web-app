// Npm Modules

const Q = require('q');
const async = require("async");
const lodash = require('lodash');
const ObjectId = require('mongodb').ObjectId;

// Static Variables

const folderController = {};
const folderDOA = require('../dao/folder.dao');
const fileDOA = require('../dao/file.dao');

const folderModel = require('../models/folder.model');
const fileModel = require('../models/file.model');
const instructorModel = require('../models/instructor.model');
const clientModel = require('../models/client.model');
const uploadService = require('../services/upload.service');

async function allfolders(query) {
    var deferred = Q.defer();

    folderModel.find(query)
        .populate('files')
        .populate('child')
        .populate('sharedClient', { _id: 1, name: 1 })
        .populate('sharedInstructor', { _id: 1, name: 1 })
        .populate({
            path: 'files',
            populate: {
                path: 'sharedClient',
                model: 'client'
            },
        })
        .populate({
            path: 'files',
            populate: {
                path: 'sharedInstructor',
                model: 'instructor'
            },
        })
        .exec((err, folders) => {
            if (err) deferred.reject(err);
            console.log("RETRIVED DATA = ", folders);
            deferred.resolve(folders);
        });
    return deferred.promise;
}


folderController.getFolders = async function (req, res, next) {

    console.log("GET FOLDER query = ", req.query);

    var query;
    if (Object.keys(req.query).length === 0) {
        console.log('Inside If Cond:::::');
        query = {
            isChild: {
                $ne: true
            }
        }

    } else {
        console.log('Inside If Else:::::');
        query = req.query;
    }



    let previousFolders = []

    getParentFolder(ObjectId(query._id), previousFolders, function (preFolders) {
        console.log(" Folders at final final ", preFolders)

        if (preFolders && preFolders.length) {
            allfolders(query).then(folders => {
                console.log("SENDING RESPONSE Folders = ", folders)
                return res.send({
                    data: {
                        folders,
                        preFolders
                    }
                });
            })
        } else {
            allfolders(query).then(folders => {
                console.log("SENDING RESPONSE Folders = ", folders)
                return res.send({
                    data: {
                        folders
                    }
                });
            })
        }
    })

    // return;
    // allfolders(query).then(folders => {
    //     console.log("SENDING RESPONSE Folders = ", folders)
    //     return res.send({ data: { folders } });
    // })
}


function getParentFolder(folderId, previousFolders, callback) {
    console.log("folder", folderId)
    folderModel.findOne({
        child: folderId
    }, {
        _id: 1,
        title: 1
    }).exec((error, folder) => {
        console.log(error, folder)
        if (error) {

        } else if (folder) {
            if (folder._id && previousFolders.indexOf(folder) > -1) {

            } else {
                previousFolders.push(folder)
                // return callback(previousFolders)
                getParentFolder(folder._id, previousFolders, function (folders) {
                    if (folders) {
                        return callback(folders)
                    } else {
                        console.log(" end ")
                    }
                })
            }
        } else {
            console.log(" end 2")
            return callback(previousFolders)
        }
    })

}


folderController.createFolder = async function (req, res, next) {
    console.log("Add Folder", req.body);
    console.log("req.body.parent", req.body.parent, typeof req.body.parent);

    // return;


    var newFolder = {};

    if (req.body.title) newFolder['title'] = req.body.title;
    if (req.user._id) newFolder['createdBy'] = req.user._id;
    if (req.body.parent && typeof req.body.parent == 'string') newFolder['parent'] = req.body.parent;
    newFolder['isChild'] = (req.body.parent && typeof req.body.parent == 'string') ? true : false
    newFolder['nameSlug'] = slugify(req.body.title);


    console.log('New Folder:::::::', newFolder);

    // return;

    folderDOA.createFolder(newFolder)
        .then(newFolderRes => {
            console.log("New Folder Controller", newFolderRes);
            return res.send({
                data: {
                    newFolderRes
                }
            })
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send({
                err
            });
        })
}


folderController.deleteFolder = function (req, res, next) {
    const folderId = req.query._id;

    console.log('DELETE Folder:', folderId);

    folderModel.remove({
        _id: folderId
    }, (err, deleted) => {
        if (err) {
            return res.status(500).send({
                err
            })
        }
        console.log("Deleted ", deleted);
        return res.send({
            data: {
                deleted
            },
            msg: "Folder Deleted Successfully"
        });
    })
}



folderController.deleteFileFromFolder = function (req, res, next) {
    let query = {};
    if (req.query) {
        query = req.query
    }
    if (!query._id) {
        return res.status(500).send("NO FILES ID FOUND");
    }
    console.log("GET Materials query = ", query, "Params = ", req.query);

    folderDOA.removeFile(query)
        .then(deleted => {
            console.log("Deleted ", deleted);
            // uploadService.s3DeleteFile().then((res) => {

            // }).catch((err) => {

            // })
            return res.send({
                data: {},
                msg: "Deleted Successfully"
            });
        }, err => {
            return res.status(500).send({
                err
            })
        })
};


/**
 * Add File Inside Folder
 */
folderController.addFile = function (req, res, next) {
    console.log("Update Folder", req.body);


    const folderId = req.body.myId;
    let re = /(?:\.([^.]+))?$/;
    let extension = re.exec(req.body.Key)[1];


    console.log(" req.user.name ", req.user)

    let newFile = {
        title: req.body.Key,
        alias: req.body.Key,
        type: "file",
        path: req.body.Location,
        size: req.body.size,
        extension: extension,
        uploadedBy: (req.user && req.user.name) ? req.user.name : 'admin',
        uploadedDate: new Date()
    }


    folderDOA.uploadFileToFolder(folderId, newFile)
        .then(updated => {
            console.log("updated ", updated);
            return res.send({
                data: {
                    file: updated
                },
                msg: "File Uploaded Successfully"
            });
        }, err => {
            return res.status(500).send({
                err
            })
        })



    // return;

    // let files = [];

    // let filesArray = [];

    // if (Array.isArray(req.files.file)) {
    //     files = req.files.file
    // } else {
    //     files[0] = req.files.file;
    // }

    // async.eachSeries(files, (singleFile, innerCallback) => {
    //     console.log('singleFile', singleFile);

    //     const folderId = req.body.folderId;

    //     let re = /(?:\.([^.]+))?$/;
    //     let ext = re.exec(singleFile.name)[1];
    //     let name = singleFile.name.split('.').slice(0, -1).join('.')

    //     let newName = name + '-' + Date.now();

    //     singleFile.name = newName + '.' + ext;



    //     let newFile = {
    //         title: newName,
    //         alias: name,
    //         type: "file", // OR SUBMISSION OR DOCUMENT
    //         path: "NEWPATH",
    //         extension: ext,
    //         // uploadedBy: req.user.name,
    //         file: singleFile,
    //         uploadedDate: new Date()
    //     }

    //     console.log('new file object', newFile, folderId);

    //     folderDOA.uploadFileToFolder(folderId, newFile)
    //         .then(updated => {
    //             console.log("updated ", updated);
    //             filesArray.push(updated);
    //             innerCallback();
    //         }, err => {
    //             return res.status(500).send({
    //                 err
    //             })
    //         })
    // }, (callbackError, callbackResponse) => {
    //     if (callbackError) {
    //         console.log("callbackError ", callbackError);
    //         return res.status(500).send({
    //             err
    //         })
    //     } else {
    //         console.log('Files Array::::::::', filesArray);
    //         return res.send({
    //             data: {
    //                 file: filesArray
    //             },
    //             msg: "File Uploaded Successfully"
    //         });
    //     }
    // })
}

// Update folder details

folderController.updateFolder = function (req, res, next) {
    console.log("Update Folder", req.body);


    var updateFolder = {};

    if (req.body.title) updateFolder['title'] = req.body.title;


    folderModel.findOneAndUpdate({
        _id: req.body.id
    }, {
        $set: updateFolder
    }, {
        new: true
    }, (err, folder) => {
        console.log("Updated folder", folder, err);
        if (err) {
            return res.status(500).send({
                err
            })
        }
        return res.send({
            data: {
                folder
            }
        });
    })
}



folderController.shareFolder = function (req, res, next) {
    console.log("Sharing Folder========>>>>>>", req.body);


    const sharedFolder = req.body.file;
    let instructorList = [];
    let clientList = [];
    let emailArrayIns = [];
    let emailArrayClient = [];
    let finalEmail = [];



    if (req.body.selectedInstructors && req.body.alreadySharedInstructor) {
        emailArrayIns = req.body.selectedInstructors.filter(o => !req.body.alreadySharedInstructor.find(o2 => o._id === o2._id))
    }

    if (req.body.selectedClients && req.body.alreadySharedClient) {
        emailArrayClient = req.body.selectedClients.filter(o => !req.body.alreadySharedClient.find(o2 => o._id === o2._id))
    }

    if (emailArrayIns.length) {
        lodash.forEach(emailArrayIns, function (singleIns) {
            finalEmail.push(singleIns.email);
        })
    }

    if (emailArrayClient.length) {
        lodash.forEach(emailArrayClient, function (singleClie) {
            finalEmail.push(singleClie.email);
        })
    }


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


    console.log('Final Email Array::::::', finalEmail);

    sharingFolder(sharedFolder, finalEmail, instructorList, clientList).then((folder) => {
        return res.send({
            data: {
                folder
            }
        });
    }).catch((error) => {
        return res.status(500).send({
            error
        })
    })
}

const sharingFolder = (folder, emailArray, instructors, clients) => {
    return new Promise((resolve, reject) => {
        folderModel.updateOne({
            _id: folder
        }, {
            $set: {
                sharedInstructor: instructors,
                sharedClient: clients
            }
        }, {
            new: true,
            upsert: true
        }, (err, updatedFolder) => {
            if (err) {
                reject(err);
            } else {
                folderDOA.sendShareFolderMail(emailArray, folder).then((mailResponse) => {
                    resolve(updatedFolder);
                }).catch((mailError) => {
                    reject(mailError)
                })
            }
        });
    })
}

folderController.shareFile = function (req, res, next) {
    console.log("Sharing File:::::::", req.body.file);
    const sharedFolder = req.body.file;
    let instructorList = [];
    let clientList = [];
    let emailArrayIns = [];
    let emailArrayClient = [];
    let finalEmail = [];


    if (req.body.selectedInstructors && req.body.alreadySharedInstructor) {
        emailArrayIns = req.body.selectedInstructors.filter(o => !req.body.alreadySharedInstructor.find(o2 => o._id === o2._id))
    }

    if (req.body.selectedClients && req.body.alreadySharedClient) {
        emailArrayClient = req.body.selectedClients.filter(o => !req.body.alreadySharedClient.find(o2 => o._id === o2._id))
    }

    if (emailArrayIns.length) {
        lodash.forEach(emailArrayIns, function (singleIns) {
            finalEmail.push(singleIns.email);
        })
    }

    if (emailArrayClient.length) {
        lodash.forEach(emailArrayClient, function (singleClie) {
            finalEmail.push(singleClie.email);
        })
    }


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


    console.log('Email Array:::', finalEmail);


    sharingFile(sharedFolder, finalEmail, instructorList, clientList).then((file) => {
        return res.send({
            data: {
                file
            }
        });
    }).catch((error) => {
        return res.status(500).send({
            error
        })
    })
}

const sharingFile = (file, emailArray, instructors, clients) => {
    return new Promise((resolve, reject) => {

        console.log('Email Array file', emailArray, file);


        fileModel.updateOne({
            _id: file._id
        }, {
            $set: {
                sharedInstructor: instructors,
                sharedClient: clients
            }
        }, {
            new: true,
            upsert: true
        }, (err, updatedFile) => {
            if (err) {
                reject(err);
            } else {
                folderDOA.sendShareFileMail(emailArray, file).then((mailResponse) => {
                    resolve(updatedFile);
                }).catch((mailError) => {
                    reject(mailError)
                })
            }
        });
    })
}

folderController.getSharedFolder = function (req, res, next) {

    let query = {
        $and: []
    }

    if (req.user.userRole == 'instructor') {
        query = {
            'sharedInstructor': ObjectId(req.user._id)
        }
    } else if (req.user.userRole == 'client') {
        query = {
            'sharedClient': ObjectId(req.user._id)
        }
    }

    allfolders(query).then(folders => {
        console.log("SENDING RESPONSE Folders = ", folders)
        return res.send({
            data: {
                folders
            }
        });
    })
}

folderController.changeFolderPosition = function (req, res, next) {
    return new Promise((resolve, reject) => {

        console.log('Inside Change Folder Function', req.body);
        const folderId = req.body.folderId;
        const parentId = req.body.parent;
        const childId = req.body.childId;


        console.log('Folder Function:::', folderId, parentId, childId);

        if (req.body.folderId && req.body.parentId && req.body.childId) {
            folderDOA.updateParentFolder(parentId, folderId).then((response) => {
                console.log('Id Pulled From Parent now push to sub folder', childId, folderId);
                folderDOA.updateSubFolder(childId, folderId).then((updateResponse) => {
                    return res.send({ data: { updateResponse } });
                }).catch((err) => {
                    return res.status(500).send({ err })
                })
            }).catch((error) => {
                return res.status(500).send({ error })
            })
        } else if (!req.body.parentId) {
            console.log('This Case Has Root Folder So No ParentId');
            folderDOA.updateSubFolder(childId, folderId).then((updateResponse) => {
                return res.send({ data: { updateResponse } });
            }).catch((err) => {
                return res.status(500).send({ err })
            })
        }
    })
}


folderController.getSharedFile = function (req, res, next) {

    return new Promise((resolve, reject) => {
        console.log('Get Shared Files::::::::', req.user);

        let query = {
            $and: []
        }

        if (req.user.userRole == 'instructor') {
            query['$and'].push({
                'sharedInstructor': ObjectId(req.user._id)
            })
        } else if (req.user.userRole == 'client') {
            query['$and'].push({
                'sharedClient': ObjectId(req.user._id)
            })
        }

        fileModel.aggregate([{
            $match: query
        },]).exec((err, files) => {
            if (err) {
                reject(err);
            } else {
                return res.send({
                    data: {
                        files
                    }
                });
            }
        });
    })
}

const slugify = function (text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}




module.exports = folderController;