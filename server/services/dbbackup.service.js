const fs = require('fs');
const _ = require('lodash');
const exec = require('child_process').exec;
const aws = require('aws-sdk')

var dbOptions = {
    user: '<databaseUsername>',
    pass: '<databasePassword>',
    host: 'localhost',
    port: 27017,
    database: 'platinum',
    autoBackup: true,
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: '/var/www/html/platinum-db-backup/' // i.e. /var/database-backup/
};
/* return date object */
exports.stringToDate = function (dateString) {
    return new Date(dateString);
}
/* return if variable is empty or not. */
const empty = (mixedVar) => {
    var undef, key, i, len;
    var emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
            return true;
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
            return false;
        }
        return true;
    }
    return false;
};

// Auto backup script
const dbAutoBackUp = () => {
    // check for auto backup is enabled or disabled
    if (dbOptions.autoBackup == true) {
        console.log('Inside Function');
        var date = new Date();
        var beforeDate, oldBackupDir, oldBackupPath;
        currentDate = this.stringToDate(date); // Current date
        var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process
        // check for remove old backup after keeping # of days given in configuration
        if (dbOptions.removeOldBackup == true) {
            beforeDate = _.clone(currentDate);
            beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
            oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
            oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
        }
        var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --out ' + newBackupPath; // Command for mongodb dump process

        // var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' --out ' + newBackupPath; // Command for mongodb dump process

        console.log('cmd---------------------', cmd);
        exec(cmd, function (error, stdout, stderr) {
            if (empty(error)) {
                // check for remove old backup after keeping # of days given in configuration
                if (dbOptions.removeOldBackup == true) {
                    if (fs.existsSync(oldBackupPath)) {
                        exec("rm -rf " + oldBackupPath, function (err) { });
                    }
                }
            }
            console.log('Sucess Backup');
        });
    }
}

// uploadDir('/var/www/html/platinum-db-backup/', settings.s3Bucket.bucket);



const uploadDir = function (s3Path, bucketName) {

    let s3 = new AWS.S3();

    function walkSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(function (name) {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                callback(filePath, stat);
            } else if (stat.isDirectory()) {
                walkSync(filePath, callback);
            }
        });
    }

    walkSync(s3Path, function (filePath, stat) {
        let bucketPath = filePath.substring(s3Path.length + 1);
        let params = { Bucket: bucketName, Key: bucketPath, Body: fs.readFileSync(filePath) };
        s3.putObject(params, function (err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log('Successfully uploaded ' + bucketPath + ' to ' + bucketName);
            }
        });

    });
};






module.exports.dbAutoBackUp = dbAutoBackUp;