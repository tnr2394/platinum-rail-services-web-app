const crypto = require('crypto');

const encryptPassword = (plainText) => {
    const mykey = crypto.createCipher('aes-128-cbc', 'platinum');
    let mystr = mykey.update(plainText, 'utf8', 'hex')
    mystr += mykey.final('hex');
    console.log(mystr);
    return mystr;
}

const decryptPassword = (cypherText) => {
    var mykey = crypto.createDecipher('aes-128-cbc', 'platinum');
    var mystr = mykey.update(cypherText, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    console.log(mystr);
    return mystr;
}

module.exports.encryptPassword = encryptPassword;
module.exports.decryptPassword = decryptPassword;