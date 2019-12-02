const jwt = require("jsonwebtoken");
/**
 * Function To Validation Of JWT Token
 * @param {authorization} - AccessToken
 * @returns {User} - Decoded User Detail
 */
module.exports.validateJWT = async (req, res, next) => {
    const { authorization } = req.headers;
    new Promise(async (resolve, reject) => {
        if (authorization && authorization !== "" && authorization == req.session.currentUser) {
            jwt.verify(authorization, 'platinum', (err, decoded) => {
                if (err) {
                    reject({ status: false, message: "Failed to authenticate token.", });
                } else {
                    req.user = decoded;
                    resolve({ status: true, user: decoded, });
                }
            });
        } else {
            reject({ status: false, message: "You Need To Login First", });
        }
    }).then(({ status, message, user }) => {
        req.user = (status) ? user : null;
        (status) ? next() : res.status(200).json({ status, message, user });
    }).catch(({ status, message }) => {
        res.status(401).json({ status, message });
    })
};
