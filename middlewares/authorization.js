'use strict';
var jwt = require('jsonwebtoken');
var db = global.db;
var authConfig = require('config').get('auth');

var requiresToken = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({
            success: false,
            message: 'token is required.'
        });
    }

    jwt.verify(token, authConfig.secret, {
        ignoreExpiration: true
    }, function(err, claims) {
        if (err) {
            return res.status(403).send({
                success: false,
                message: 'token is required.'
            });
        }
        if(claims.user){
            db.user.findOne({where:{ id: claims.user}}).then(user => {
                if (!user) {
                    throw ('no user found');
                }
                if (user.status == 'inactive'){
                    return res.status(403).send({
                        success: false,
                        message: 'Your account is inactive.'
                    });
                }
                if (user.status == 'blocked'){
                    return res.status(401).send({
                        success: false,
                        message: 'user blocked.'
                    });
                }
                if (user.status == 'deleted'){
                    return res.status(402).send({
                        success: false,
                        message: 'Your account is deleted.'
                    });
                }
                req.user = user;
                next();
            })
            .catch(err => {
                res.failure(err);
            });
        }
    });
};

exports.requiresToken = requiresToken;

exports.requiresTokenOptional = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token)
        return requiresToken(req, res, next);

    req.user = null;
    next();
};

exports.getUserToken = user => {
    var claims = {
        user: user.id
    };
    return jwt.sign(claims, authConfig.secret, {
        expiresIn: authConfig.tokenPeriod || 1440
    });
};

exports.newPin = () => {
    return Math.floor(1000 + Math.random() * 9000);
};