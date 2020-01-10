var file = {};

var Q = require('q');
var fileModel = require('../models/file.model');
var aws = require('aws-sdk')
var multer = require('multer')
var path = require('path');
const fs = require('fs-extra');
var multerS3 = require('multer-s3')

const s3UploadService = require('../services/upload.service');

var s3 = new aws.S3({ /* ... */ })
var storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    }
});

var multipleUpload = multer({ storage: storage }).array('file');


file.getFiles = async function (query) {
    var q = Q.defer();
    console.log("GET files query = ", query, "Params = ", query);
    fileModel.find(query, (err, files) => {
        if (err) q.reject(err)
        q.resolve(files)
        console.log("SENDING RESPONSE Clients =  ", files);
    })
    return q.promise;
}

file.getfile = async function (query) {
    console.log("GET FILE ", query);
    var q = Q.defer();
    fileModel.findById(query._id, (err, file) => {
        console.log("GET file RES = ", file);
        if (err) q.reject(err);
        else q.resolve(file);
    })
    return q.promise;
}


file.addFile = function (object) {
    console.log("ADD File in file DOA", object);
    var q = Q.defer();

    return new Promise((resolve, reject) => {
        s3UploadService.s3UploadFile(object.file, null, null)
            .then((uploadRes) => {
                console.log('File Upload uploadRes:', uploadRes);
                if (uploadRes) {
                    const s3File = {
                        title: object.title,
                        type: object.type,
                        path: uploadRes.Location,
                        extension: object.extension,
                        uploadedBy: object.uploadedBy,
                    }
                    var newFile = new fileModel(s3File);
                    console.log("NEW FILE TO BE ADDED IN MODEL =", newFile);
                    newFile.save((err, file) => {
                        console.log("File Uploaded Successfully =  ", file, err);
                        if (err) return reject(err);
                        else return resolve(file);
                    });
                } else {
                    console.log("File Resposnse not comes");
                }

                // return q.promise;
            }).catch((error) => {
                console.log('Error:', error);
                return reject(error);
            })
    })

}




file.updateFile = function (object) {
    console.log("Update Files", object);
    console.log("ADD File", object);
    var q = Q.defer();
    // UPLOAD FILE CODE HERE. 
    // 1. UPLOAD FILE TO S3 Bucket
    // 2. Add path to the newFile object
    // 3. Return New File object after uploading it to "files" collection
    var updatedFile = {
        title: file.title,
        path: "NEW PATH",
        uploadedBy: object.uploadedBy
    };
    fileModel.findByIdAndUpdate(object._id, updatedFile, { new: true }, (err, file) => {
        if (err) q.reject(err);
        else {
            console.log("File Uploaded & Updated Successfully =  ", file);
            q.resolve(file);
        }
    });
    return q.promise;

}

file.deleteFile = function (object) {
    console.log("Delete file");
    var q = Q.defer();

    let fileId = object._id;
    console.log("file to be deleted : ", fileId);
    fileModel.deleteOne({ _id: fileId }, (err, deleted) => {
        if (err) q.reject(err);
        console.log("Deleted ", deleted);
        q.resolve(deleted);
    });
    return q.promise;
}

module.exports = file;