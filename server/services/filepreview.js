var child_process = require('child_process');

function generatePdf(filePath, fileTitle){
    child_process.exec('unoconv -f pdf --output=/home/heer/Desktop/'+ fileTitle + '.pdf ' + filePath , (err, stdout, stderr) => {
    if (err) {
        //some err occurred
        console.error(err)
    } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        generateJpg(fileTitle)
    }
});
}
function generateJpg(fileTitle) { 
    child_process.exec('unoconv -f jpg ' + '/home/heer/Desktop/' + fileTitle + '.pdf', (err, stdout, stderr) => {
    if (err) {
        //some err occurred
        console.error(err)
    } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    }
});
}

module.exports.generatePdf = generatePdf;