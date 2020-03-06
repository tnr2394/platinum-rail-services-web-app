const async = require("async");

const competenciesDOA = require('../dao/competencies.dao')

const competenciesController = {};


competenciesController.addCompetencies = async function (req, res, next) {
    console.log("ADD Competencies", req.body);

    let newCompetencies = {};
    const instructorId = req.body.instructorId;
    if (req.body.title) newCompetencies['title'] = req.body.title;
    if (req.body.expiryDate) newCompetencies['expiryDate'] = req.body.expiryDate;
    if (req.body.instructorId) newCompetencies['instructor'] = req.body.instructorId;

    competenciesDOA.addCompetencies(newCompetencies).then(newComp => {
        console.log('New Comp in Controller:', newComp);
        competenciesDOA.pushCompetenciesIntoInstructor(instructorId, newComp._id)
            .then(updatedIns => {
                return res.send({ data: { competencies: newComp } })
            }).catch(err => {
                console.error(err);
                return res.status(500).send({ err });
            })
    }, err => {
        return res.status(500).send({ err });
    });
}

competenciesController.updateCompetencies = async function (req, res, next) {

    const competenciesId = req.body.competenciesId;

    let newCompetencies = {};
    if (req.body.title) newCompetencies['title'] = req.body.title;
    if (req.body.expiryDate) newCompetencies['expiryDate'] = req.body.expiryDate;

    competenciesDOA.updateCompetencies(competenciesId, newCompetencies).then((res) => {
        return res.send({ data: { competencies: res } })
    }).catch((err) => {
        return res.status(500).send({ err });
    })
}

competenciesController.deleteCompetencies = async function (req, res, next) {
    const competenciesId = req.query.id;
    console.log('Competencies Remove Function', competenciesId)
    competenciesDOA.deleteCompetencies(competenciesId).then(newComp => {
        competenciesDOA.pullCompetenciesFromInstructor(competenciesId, newComp.instructor)
            .then(updatedIns => {
                return res.send({ data: { newComp }, msg: "Deleted Successfully" });
            }).catch(err => {
                console.error(err);
                return res.status(500).send({ err });
            })
    }, err => {
        return res.status(500).send({ err });
    });
}


competenciesController.addFilesToCompetencies = async function (req, res, next) {
    console.log("ADD Files Into Competencies", req.body);
    const competenciesId = req.body.myId;
    let re = /(?:\.([^.]+))?$/;
    let extension = re.exec(req.body.Key)[1];

    console.log(" req.user.name ", req.user)

    let newFile = {
        title: req.body.Key,
        alias: req.body.Key,
        type: "file",
        path: req.body.Location,
        size: req.body.size,
        extension: extension.toLowerCase(),
        uploadedBy: (req.user && req.user.name) ? req.user.name : 'admin',
        uploadedDate: new Date()
    }

    competenciesDOA.uploadFileToCompetencies(competenciesId, newFile)
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
}



competenciesController.getCompetencies = async function (req, res, next) {
    const instructorId = req.query.id;
    console.log('Competencies List Function', instructorId)
    competenciesDOA.getCompetencies(instructorId).then(updatedIns => {
        return res.send({ data: { competencies: updatedIns } })
    }).catch(err => {
        console.error(err);
        return res.status(500).send({ err });
    })
}

module.exports = competenciesController;