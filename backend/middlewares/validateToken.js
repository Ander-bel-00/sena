const jwt = require('jsonwebtoken');
const TOKEN_S = require('../config/config');

const authRequired = (req, res, next) => {

    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    jwt.verify(token, TOKEN_S, (err, user) => {
        if (err) return res.status(498).json({ mensaje: 'invalid token' });

        req.user = user;

        next();
    });
    
}

module.exports = authRequired;