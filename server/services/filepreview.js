var child_process = require('child_process');
const s3UploadService = require('../services/upload.service');
var fs = require('fs')
// Change tempPath 
var tempPath = '/home/rao/Desktop/thumbnail/'
// var tempPath = '/home/heer/Desktop/'
function generatePdf(filePath, fileTitle) {
    let name = slugify(fileTitle);
    return new Promise((resolve, reject) => {
        child_process.exec('unoconv -f pdf --output=' + tempPath + name + '.pdf ' + filePath, (err, stdout, stderr) => {
            if (err) {
                //some err occurred
                console.error(err)
            } else {
                // the *entire* stdout and stderr (buffered)
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                generateJpg(name).then((jpgResponse) => {
                    readFile(jpgResponse).then((fileResponse) => {
                        uploadJpg(fileResponse).then((finalRes) => {
                            resolve(finalRes)
                        }).catch((finalError) => {
                            console.log("finalError", finalError);
                        })
                    }).catch((error) => {
                        console.log("fileResponse Error",error);
                    })
                }).catch((error) => {
                    console.log("jpgResponse Error", error);
                })
            }
        });

    })

}
function generateJpg(name) {
    console.log("In generate file", name);

    return new Promise((resolve, reject) => {
        child_process.exec('unoconv -f jpg ' + tempPath + name + '.pdf', (err, stdout, stderr) => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                let fileData = {
                    path: tempPath + name + '.jpg',
                    fileTitle: name
                }
                resolve(fileData)
                // return readFile()
            }
        });
    })
}
function readFile(fileData) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileData.path, function (err, data) {
            if (err) {
                reject(err)
            }
            else {
                file = {
                    data: data,
                    name: fileData.fileTitle
                }
                console.log("----------FILE----------", file);
                resolve(file)
                // return uploadJpg(file)
            }
        })
    })

}

function uploadJpg(file) {
    return new Promise((resolve, reject) => {
        s3UploadService.s3UploadFile(file, null, null, true).then((uploadRes) => {
            console.log("*************uploadRes in filepreview service", uploadRes);
            return resolve(uploadRes);
        })
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
module.exports.generatePdf = generatePdf;