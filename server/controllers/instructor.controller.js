//Npm Modules

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailService = require('../services/mail.service');



var instructorModel = require('../models/instructor.model');
var Q = require('q');

var instructorController = {};

async function allInstructors() {
    var deferred = Q.defer();

    instructorModel.find({}, (err, instructors) => {
        if (err) deferred.reject(err);
        console.log("RETRIVED DATA = ", instructors);
        deferred.resolve(instructors);
    });
    return deferred.promise;

}
instructorController.getInstructors = async function (req, res, next) {
    console.log("GET Instructors");
    allInstructors().then(instructors => {
        console.log("SENDING RESPONSE instructors = ", instructors)
        return res.send({ data: { instructors } });
    })
}

instructorController.addInstructor = function (req, res, next) {
    console.log("ADD Instructor", req.body);

    var newInstructor = new instructorModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        dateOfJoining: req.body.dateOfJoining
    });
    newInstructor.save((err, instructor) => {
        console.log("SENDING RESPONSE Instructors = ", instructor)
        
        return res.send({ data: { instructor } });
    })
}

instructorController.updateInstructor = function (req, res, next) {
    console.log("Update Instructor", req.body);

    var updatedInstructor = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        dateOfJoining: req.body.dateOfJoining
    };

    instructorModel.findOneAndUpdate({ _id: req.body._id }, { $set: updatedInstructor }, { new: true }, (err, instructor) => {
        console.log("Updated instructor", instructor, err);
        if (err) {
            return res.status(500).send({ err })
        }
        return res.send({ data: { instructor } });
    });
}


instructorController.deleteInstructor = function (req, res, next) {
    console.log("Delete Instructor");
    let instructorId = req.query._id;
    console.log("Course to be deleted : ", instructorId);
    instructorModel.deleteOne({ _id: instructorId }, (err, deleted) => {
        if (err) {
            return res.status(500).send({ err })
        }
        console.log("Deleted ", deleted);
        return res.send({ data: {}, msg: "Deleted Successfully" });
    })
}

instructorController.loginInstructor = function (req, res, next) {
    console.log("Login Instructor");

    const email = req.body.email;
    const password = req.body.password;

    instructorModel.findOne({ email: email }).exec((err, instructor) => {
        if (err) {
            return res.status(500).send({ err })
        } else if (instructor) {
            if (password == instructor.password) {
                const payload = { instructor };
                var token = jwt.sign(payload, 'platinum');
                req.session.currentUser = token;
                return res.status(200).json({ message: 'Login Successfully', data: token, userRole: 'instructor' });
            } else {
                return res.status(400).json({ message: 'Login failed Invalid password' });
            }
        } else {
            return res.status(400).json({ message: 'Login failed Invalid email' });
        }
    });
}





module.exports = instructorController;