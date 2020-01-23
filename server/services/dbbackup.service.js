const fs = require('fs');
const _ = require('lodash');
const aws = require('aws-sdk')
const mongoS3Backup = require('mongo-dump-s3-2');

let currentDate = new Date();
let newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();



const backupClient = mongoS3Backup({
    bucketName: 'platinum-database-backup',
    accessKey: '',
    accessSecret: ''
});



function dbAutoBackUp() {
    backupClient.backupDatabase({ uri: 'mongodb://localhost/' + 'platinum', backupName: 'platinum' + newBackupDir })
        .then(response => {
            console.log('Success response ', response)
            listDirectories(); //show all files in s3
        })
        .catch(err => {
            console.log("Error", err)
        })

}

function listDirectories() {
    const s3params = {
        Bucket: 'platinum-database-backup',
        MaxKeys: 20,
        Delimiter: '/',
    };
    s3.listObjectsV2(s3params, (err, data) => {
        if (err) {
            console.log(err);
        }
        for (let i = 0; i < data.Contents.length; i++) {
            dates[i] = data.Contents[i].LastModified
            fileName[i] = data.Contents[i].Key
        }
        getValidDB(dates) //remove files created before 7 days
    });
};

function getValidDB(dates) {
    var dateOffset = (24 * 60 * 60 * 1000) * 7; //7 days
    var expectedDate = new Date();
    expectedDate.setTime(expectedDate.getTime() - dateOffset);

    for (let i = 0; i < dates.length; i++) {
        //check if file is old or not
        if (dates[i].toISOString().split('T')[0] <= expectedDate.toISOString().split('T')[0]) {
            console.log(true);
            var params = {
                Bucket: 'rao-database-backup',
                Key: fileName[i]
            };

            s3.deleteObject(params, function (err, data) { //remove from s3
                if (err) console.log(err);  // an error occurred
                else console.log(data); // successful response
            });
        }
    }
}

module.exports.dbAutoBackUp = dbAutoBackUp;