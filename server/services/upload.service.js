// Npm modules
const aws = require('aws-sdk')

/**
 * Upload a file using the Amazon S3 Bucket Service
 * @param {Object} options The options to send the mail like to, from and subject
 * @param {Object} file The file to be upload
 * @param {String} folder <Optional> specific folder name to upload file
 */
const s3UploadFile = (file, folder, options, isThumbnail) => {
    return new Promise((resolve, reject) => {
        //     console.log('Inside S3 File:', process.env.Bucket);

        console.log('settings::::', settings);
        if (isThumbnail) {
            var s3bucket = new aws.S3({
                accessKeyId: settings.s3Bucket.key,
                secretAccessKey: settings.s3Bucket.secret,
                Bucket: settings.s3Bucket.thumbnail_bucket,
            });

        } else {
            var s3bucket = new aws.S3({
                accessKeyId: settings.s3Bucket.key,
                secretAccessKey: settings.s3Bucket.secret,
                Bucket: settings.s3Bucket.bucket,
            });

        }


        s3bucket.createBucket(function () {
            var params;
            if(isThumbnail){
                let currentEnv;
                if (config.env.name == 'development') currentEnv = 'development/'
                else if (config.env.name == 'production') currentEnv = 'production/'
                else if (config.env.name == 'testing') currentEnv = 'testing/'
                var params = {
                    Bucket: settings.s3Bucket.thumbnail_bucket,
                    Key: currentEnv+file.name,
                    Body: file.data,
                };
            }
            else{
                var params = {
                    Bucket: settings.s3Bucket.bucket,
                    Key: file.name,
                    Body: file.data,
                };
            }
            console.log('PARAM:', params);
            console.log('settings::::', settings);

            // var s3bucket = new aws.S3({
            //     accessKeyId: settings.s3Bucket.key,
            //     secretAccessKey: settings.s3Bucket.secret,
            //     Bucket: settings.s3Bucket.bucket,
            // });

            // s3bucket.createBucket(function () {

            //     const params = {
            //         Bucket: settings.s3Bucket.bucket,
            //         Key: file.name,
            //         Body: file.data,
            //     };

            //     console.log('PARAM:', params);

            //     s3bucket.createMultipartUpload(params, function (err, uploadedResponse) {
            //         if (err) {
            //             console.error("error while upload into S3 bucket", err);
            //             return reject(err);
            //         } else {
            //             console.log("uploadedResponse after aupload in service", uploadedResponse);
            //             return resolve(uploadedResponse)
            //         }
            //     });
            // });

            // var s3 = new aws.S3();

        var s3 = new aws.S3({
            accessKeyId: settings.s3Bucket.key,
            secretAccessKey: settings.s3Bucket.secret,
            Bucket: settings.s3Bucket.bucket,
        });


        var buffer = file.data;

        var startTime = new Date();
        var partNum = 0;
        var partSize = 1024 * 1024 * 5; // 5mb chunks except last part
        var numPartsLeft = Math.ceil(buffer.length / partSize);
        var maxUploadTries = 3;

        var multipartParams = {
            Bucket: 'testing-platinum-rail-services',
            Key: file.name,
            ContentType: file.type
        };

        var multipartMap = {
            Parts: []
        };

        console.log('Creating multipart upload for:', file.name);
        s3.createMultipartUpload(multipartParams, function (mpErr, multipart) {
            if (mpErr) return console.error('Error!', mpErr);
            console.log('Got upload ID', multipart.UploadId);

            for (var start = 0; start < buffer.length; start += partSize) {
                partNum++;
                var end = Math.min(start + partSize, buffer.length);
                var partParams = {
                    Body: buffer.slice(start, end),
                    Bucket: multipartParams.Bucket,
                    Key: multipartParams.Key,
                    PartNumber: String(partNum),
                    UploadId: multipart.UploadId
                };

                console.log('Uploading part: #', partParams.PartNumber, ', Start:', start);
                uploadPart(s3, multipart, partParams);
            }
        });

        function completeMultipartUpload(s3, doneParams) {
            s3.completeMultipartUpload(doneParams, function (err, data) {
                if (err) {
                    console.error('An error occurred while completing multipart upload');
                    reject(err)
                }

                var delta = (new Date() - startTime) / 1000;
                console.log('Completed upload in', delta, 'seconds');
                console.log('Final upload data:', data);
                return resolve(data)
            });
        }

        function uploadPart(s3, multipart, partParams, tryNum) {
            var tryNum = tryNum || 1;
            s3.uploadPart(partParams, function (multiErr, mData) {
                console.log('started');
                if (multiErr) {
                    console.log('Upload part error:', multiErr);

                    if (tryNum < maxUploadTries) {
                        console.log('Retrying upload of part: #', partParams.PartNumber);
                        uploadPart(s3, multipart, partParams, tryNum + 1);
                    } else {
                        console.log('Failed uploading part: #', partParams.PartNumber);
                    }
                    // return;
                }

                multipartMap.Parts[this.request.params.PartNumber - 1] = {
                    ETag: mData.ETag,
                    PartNumber: Number(this.request.params.PartNumber)
                };
                console.log('Completed part', this.request.params.PartNumber);
                console.log('mData', mData);
                if (--numPartsLeft > 0) return; // complete only when all parts uploaded

                var doneParams = {
                    Bucket: multipartParams.Bucket,
                    Key: multipartParams.Key,
                    MultipartUpload: multipartMap,
                    UploadId: multipart.UploadId
                };

                console.log('Completing upload...');
                completeMultipartUpload(s3, doneParams);
            }).on('httpUploadProgress', function (progress) { console.log(Math.round(progress.loaded / progress.total * 100) + '% done') });
        }
        });







        
    })
}

module.exports.s3UploadFile = s3UploadFile;
