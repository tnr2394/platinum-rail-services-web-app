// const aws = require('aws-sdk')
// const multer = require('multer')
// const multerS3 = require('multer-s3')


// const s3bucket = new aws.S3({
//     accessKeyId: 'AKIAWVUMJVVMNYKAG3VK',
//     secretAccessKey: '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',
//     Bucket: 'testing-platinum-rail-services',
// });

// const upload = multer({
//     storage: multerS3({
//         s3: s3bucket,
//         bucket: 'testing-platinum-rail-services',
//         key: function (req, file, cb) {
//             console.log('Req======>>>>', file);
//             /*I'm using Date.now() to make sure my file has a unique name*/
//             req.file = Date.now() + file.originalname;
//             cb(null, Date.now() + file.originalname);
//         }
//     })
// })

// module.exports = upload;

// const aws = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');

// aws.config.update({
//     secretAccessKey: 'so8E+kY9LOI1iGOCPe1spmExq9NQJ4gmNJjwf5Q0',
//     accessKeyId: 'AKIAWVUMJVVMNYKAG3VK',
//     // region: 'YOUR AWS REGION' //E.g us-east-1
// });

// const s3 = new aws.S3();

// /* In case you want to validate your file type */
// const fileFilter = (req, file, cb) => {
//     console.log('File=======>>>>', file);
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(new Error('Wrong file type, only upload JPEG and/or PNG !'),
//             false);
//     }
// };

// module.exports.upload = multer({
//     fileFilter: fileFilter,
//     storage: multerS3({
//         acl: 'public-read',
//         s3,
//         bucket: 'testing-platinum-rail-services',
//         key: function (req, file, cb) {
//             /*I'm using Date.now() to make sure my file has a unique name*/
//             req.file = Date.now() + file.originalname;
//             cb(null, Date.now() + file.originalname);
//         }
//     })
// });

