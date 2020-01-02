const request = require('request');

const verifyRecaptcha = (recaptchaToken) => {
    return new Promise((resolve, reject) => {
        const recaptchaSecretKey = process.env.RECAPTCHASECRETKEY;
        const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + recaptchaSecretKey + "&response=" + recaptchaToken;

        request(verificationURL, function (error, response, body) {
            body = JSON.parse(body);
            if (body.success !== undefined && !body.success) {
                reject({ status: 500, message: 'Failed captcha verification' });
            } else {
                resolve({ status: 200, message: 'captha verify successfully.', data: response })
            }
        })
    })
}

module.exports.verifyRecaptcha = verifyRecaptcha;
