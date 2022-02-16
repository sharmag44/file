'use strict';
var jwt = require('jsonwebtoken');
var db = global.db;
var authConfig = require('config').get('authConfig');

exports.validateToken = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            success: false,
            message: 'token is required.'
        });
    }

    jwt.verify(token, authConfig.secret, function(err, claims) {
        if (err) {
            return res.status(403).send({
                success: false,
                message: err
            });
        }
        next();
    });
}

exports.validateRefreshToken = (req, res, next) => {
    var refreshToken = req.cookies.refreshToken || req.headers['refreshToken'];

    if (!refreshToken) {
        return res.status(403).send({
            success: false,
            message: 'refreshToken is required.'
        });
    }

    jwt.verify(refreshToken, authConfig.refreshSecret, function(err, claims) {
        if (err) {
            return res.status(403).send({
                success: false,
                message: err
            });
        }
        req.user = claims;
        next();
    });
}

exports.getAccessToken = user => {
    var claims = {
        user: user.id
    };
    return jwt.sign(claims, authConfig.secret, {
        expiresIn: authConfig.tokenPeriod
    });
};

exports.getRefreshToken = user => {
    var claims = {
        user: user.id
    };
    return jwt.sign(claims, authConfig.refreshSecret, {
        expiresIn: authConfig.refreshPeriod
    });
};