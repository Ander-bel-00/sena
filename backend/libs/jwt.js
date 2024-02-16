const jwt = require('jsonwebtoken');
const TOKEN_S = require('../config/config');

function createAccessToken (payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,

            TOKEN_S,{
                expiresIn: "1h",
            },(err, token) => {
                err ? (
                    reject(err)
                ):(

                    resolve(token)
                )
            }
        )
    });
};

module.exports = createAccessToken;