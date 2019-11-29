// Npm modules
const aws = require('aws-sdk')



/**
 * Upload a file using the Amazon S3 Bucket Service
 * @param {Object} options The options to send the mail like to, from and subject
 * @param {Object} file The file to be upload
 * @param {String} folder <Optional> specific folder name to upload file
 */
const s3UploadFile = (file, folder, options) => {
    return new Promise((resolve, reject) => {
        console.log('Inside S3 File:', file);

        var s3bucket = new aws.S3({
            accessKeyId: 'AKIAXDGTPD32OKQEXFMV',
            secretAccessKey: '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',
            Bucket: 'tripion-testing',
        });

        s3bucket.createBucket(function () {

            const params = {
                Bucket: 'tripion-testing',
                Key: file.name,
                Body: file.data,
            };

            s3bucket.upload(params, function (err, uploadedResponse) {
                console.log("Yash2");
                if (err) {
                    console.error("error while upload into S3 bucket", err);
                    return reject(err);
                } else {
                    console.log("uploadedResponse after aupload in service", uploadedResponse);
                    return resolve(uploadedResponse)
                }
            });
        });
    });
}

module.exports.s3UploadFile = s3UploadFile;
