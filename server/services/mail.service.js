const mailer = require('nodemailer');
const path = require('path');
const ses = require('nodemailer-ses-transport');
const AWS = require('aws-sdk');


const compiler = require('../services/pug.service');

module.exports.sendMail = sendMail;

// Ses Configuration here

// var sesService = new AWS.SES({
//     accessKeyId: "accessKeyId",
//     secretAccessKey: 'secretAccessKey',
//     region: settings.awsMailer.region
// });

/**
 * Send an mail using the Amazon SES Service
 * @param {Object} options The options to send the mail like to, from and subject
 * @param {Object} data The data which is needed in the mail template <Optional>
 * @param {Array} attach Attachments <Optional>
 * @param {Function} callback Callback with error or result
 */
function sendMail(options, data, attach, callback) {
    //Keys from the user SESMailer in the AWS Console. User has only Full API Access for the SES service
    // var transporter = mailer.createTransport(ses({
    //     accessKeyId: settings.awsMailer.accessKeyId,
    //     secretAccessKey: settings.awsMailer.secretAccessKey,
    //     region: settings.awsMailer.region
    // }));


    console.log('Inside send mail function');

    const transporter = mailer.createTransport({
        host: process.env.HOST,
        port: process.env.SMTPPORT,
        secure: process.env.SECURE,
        auth: {
            user: process.env.SMTPUSERNAME,
            pass: process.env.PASSWORD,
        },
    });


    if (!data) {
        data = {};
    }

    //Fill default options
    if (!options.from) {
        options.from = '"platinum rail services"<no-reply@platinum.com>';
    }

    if (!options.type) {
        options.type = null
    }
    if (options.priority) {
        var headers;
        if (options.priority == 'high') {
            headers = {
                "x-priority": "1",
                "x-msmail-priority": "High",
                "importance": "high"
            }
        } else if (options.priority == 'low') {
            headers = {
                "x-priority": "5",
                "x-msmail-priority": "low",
                "importance": "low"
            }
        }

    }

    function getHtml(options, callback) {
        if (options.emailTemplate == undefined || !options.emailTemplate) {
            //compile html template
            var templatePath = path.join(__dirname, '..', 'emailTemplate', options.template + '.pug');
            compiler(templatePath, data, function (err, html) {
                if (err) {
                    return callback(err);
                }
                return callback(null, html);
            })
        } else {
            return callback(null, options.emailTemplate);
        }
    }

    if (attach != null) {
        var attachments = [];

        async.eachSeries(attach, function (item, callback) {
            var attachment = {
                filename: item.filename,
                content: item.content,
                encoding: 'base64'
            }
            attachments.push(attachment);
            callback();
        }, function () {

        })
    }

    getHtml(options, function (err, html) {
        if (err) {
            console.log('Something Error compiling pug file: ', err);
        } else {
            transporter.sendMail({
                from: options.from,
                to: options.to,
                bcc: options.bcc ? options.bcc : null,
                cc: options.cc ? options.cc : null,
                subject: options.subject,
                html: html,
                attachments: attachments ? attachments : null,
                headers: headers ? headers : null
            }, function (err, result) {
                if (err) {
                    console.error("Error while sending email", err)
                    if (err.name == 'MessageRejected') {
                        return callback("MSG_REJECTED", null);
                    } else {
                        if (typeof callback == 'function') {
                            return callback(err, null);
                        }
                    }
                } else {
                    if (typeof callback === 'function') {
                        return callback(null, data);
                    }
                }
            })
        }
    })
}




