var materialDOA = require('../dao/material.dao');
var courseDOA = require('../dao/course.dao');
var fileDOA = require('../dao/file.dao');
var Q = require('q');
const async = require("async");

var materialController = {};

async function allMaterials() {
    var deferred = Q.defer();

    materialModel.find({}, (err, clients) => {
        if (err) deferred.reject(err);
        // console.log("RETRIVED DATA = ",clients);
        deferred.resolve(clients);
    });
    return deferred.promise;
}

materialController.getMaterials = async function (req, res, next) {
    let query = {};
    if (req.query) {
        query = req.query
    }
    console.log("GET Materials query = ", query, "Params = ", req.query);
    materialDOA.getMaterialsByQuery(query)
        .then(material => {
            console.log("Returing material - " + material.length);
            return res.send({
                data: {
                    material
                }
            });
        }, err => {
            console.error(err);
            return res.status(500).send({
                err
            });
        })
}

materialController.getMaterial = async function (req, res, next) {
    console.log("GET client ", req.params.id);
    materialModel.findById(req.param.id, (err, material) => {
        console.log("GET material RES = ", material);
        return res.send({
            data: {
                material
            }
        })
    })
}

materialController.addMaterial = async function (req, res, next) {
    console.log("ADD material", req.body);

    let newmaterial = {};

    if (req.body.course) newmaterial['course'] = req.body.course;
    if (req.body.title) newmaterial['title'] = req.body.title;
    if (req.body.type) newmaterial['type'] = req.body.type;
    if (req.body.unitNo) newmaterial['unitNo'] = req.body.unitNo;
    if (req.body.assignmentNo) newmaterial['assignmentNo'] = req.body.assignmentNo;

    materialDOA.createMaterial(newmaterial).then(newmaterial => {
        console.log("Material Created in controller. Calling AddMaterial for courseDOA", newmaterial);

        // Adding it to course.materials
        courseDOA.addMaterial(newmaterial.course, newmaterial._id)
            .then(updatedCourse => {
                console.log("Course added to material and back to controller", updatedCourse);
                return res.send({
                    data: {
                        material: newmaterial
                    }
                })
            })
            .catch(err => {
                console.error(err);
                return res.status(500).send({
                    err
                });
            })

        // console.log("Created material",newmaterial);
    }, err => {
        return res.status(500).send({
            err
        });
    });
}


materialController.updateMaterial = async function (req, res, next) {

    var updatedMaterial = {};

    if (req.body._id) updatedMaterial['_id'] = req.body._id;
    if (req.body.title) updatedMaterial['title'] = req.body.title;
    if (req.body.unitNo) updatedMaterial['unitNo'] = req.body.unitNo;
    if (req.body.assignmentNo) updatedMaterial['assignmentNo'] = req.body.assignmentNo;

    console.log("Update material DOA in material-Controller", updatedMaterial);

    materialDOA.updateMaterial(updatedMaterial).then(material => {
        console.log("Updated material in controller", material);
        courseDOA.addMaterial(req.body.course, material._id)
            .then(updatedCourse => {
                console.log("Material ID added to Course ", updatedCourse);
                return res.send({
                    data: {
                        material
                    }
                });
            })
    }, err => {
        console.error(err);
        return res.status(500).send({
            err
        })
    })
        .catch(err => {
            console.error(err);
        })
}

materialController.deleteMaterial = function (req, res, next) {
    console.log("Delete material");
    let materialId = req.query._id;
    console.log("material to be deleted : ", materialId);
    materialDOA.deleteMaterial(materialId)
        .then(deleted => {
            console.log("Deleted ", deleted);
            return res.send({
                data: {},
                msg: "Deleted Successfully"
            });
        }, err => {
            return res.status(500).send({
                err
            })
        })
}



materialController.addFile = (req, res, next) => {
    // Add File in File DAO.
    // Add file id in Material DAO.
    console.log("ADD FILES REACHED");
    console.log("FILES=", req.files);
    console.log("body=", req.body);

    let files = [];

    let filesArray = [];

    if (Array.isArray(req.files.file)) {
        files = req.files.file
    } else {
        files[0] = req.files.file;
    }



    async.eachSeries(files, (singleFile, innerCallback) => {

        materialId = req.body.materialId;
        if (!materialId) return res.status(500).send({
            msg: "Material ID not found"
        });

        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(singleFile.name)[1];
        var name = singleFile.name.split('.').slice(0, -1).join('.')
        let newName = name + '-' + Date.now();

        singleFile.name = newName + '.' + ext;

        var newFile = {
            title: newName,
            alias: name,
            type: "material", // OR SUBMISSION OR DOCUMENT
            path: "NEWPATH",
            extension: ext,
            uploadedBy: req.user.name,
            file: singleFile,
            uploadedDate: new Date()
        }


        fileDOA.addFile(newFile).then((addedFile) => {
            console.log("File added in collection. now adding it to materials.", addedFile);
            materialDOA.addFile(materialId, addedFile._id).then((updatedMaterial) => {
                console.log("material Updated", updatedMaterial);
                filesArray.push(addedFile);
                innerCallback();
            }).catch(err => {
                console.error(err);
            })
        }).catch((err) => {
            console.error(err);
        })
    }, (callbackError, callbackResponse) => {
        if (callbackError) {
            console.log("callbackError ", callbackError);
            return res.status(500).send({
                err
            })
        } else {
            return res.send({
                data: {
                    file: filesArray
                },
                msg: "Material Uploaded Successfully"
            });
        }
    })
}

materialController.getFiles = function (req, res, next) {
    let query = {};
    if (req.query) {
        query = req.query
    }
    if (!query._id) {
        return res.status(500).send("NO MATERIAL ID FOUND");
    }
    console.log("GET Materials query = ", query, "Params = ", req.query);

    materialDOA.getFiles(query)
        .then(foundMaterial => {
            console.log("Returing material - " + foundMaterial.files.length);

            return res.send({
                data: {
                    files: foundMaterial.files
                }
            });
        }, err => {
            console.error(err);
            return res.status(500).send({
                err
            });
        })

};

materialController.deleteFile = function (req, res, next) {
    let query = {};
    if (req.query) {
        query = req.query
    }
    if (!query._id) {
        return res.status(500).send("NO FILES ID FOUND");
    }
    console.log("GET Materials query = ", query, "Params = ", req.query);

    materialDOA.removeFile(query)
        .then(deleted => {
            console.log("Deleted ", deleted);
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

module.exports = materialController;