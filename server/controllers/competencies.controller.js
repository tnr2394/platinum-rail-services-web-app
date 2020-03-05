const async = require("async");

const competenciesDOA = require('../dao/competencies.dao')

const competenciesController = {};


competenciesController.addCompetencies = async function (req, res, next) {
    console.log("ADD Competencies", req.body);

    let newCompetencies = {};

    const instructorId = req.body.instructorId;
    if (req.body.title) newCompetencies['title'] = req.body.title;
    if (req.body.files) newCompetencies['files'] = req.body.files;
    if (req.body.expiryDate) newCompetencies['expiryDate'] = req.body.expiryDate;

    competenciesDOA.addCompetencies(newCompetencies).then(newComp => {
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

module.exports = competenciesController;