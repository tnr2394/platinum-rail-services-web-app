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
        console.log('Inside S3 File:', process.env.Bucket);

        console.log('settings----->>>>>>>>', settings);

        var s3bucket = new aws.S3({
            accessKeyId: settings.s3Bucket.key,
            secretAccessKey: settings.s3Bucket.secret,
            Bucket: settings.s3Bucket.bucket,
        });

        s3bucket.createBucket(function () {

            const params = {
                Bucket: settings.s3Bucket.bucket,
                Key: file.name,
                Body: file.data,
            };

            console.log('PARAM:', params);

            s3bucket.upload(params, function (err, uploadedResponse) {
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