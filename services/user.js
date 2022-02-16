'use strict';
var bcrypt = require('bcrypt-nodejs');
const _ = require('underscore');

exports.setPassword = (password, callback) => {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            callback(err);
        }
        bcrypt.hash(password, salt, null, function(err, hash) {
            callback(err, hash);
        });
    });
}

exports.comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, function(err, isPasswordMatch) {
        if (err) {
            callback(err);
        }
        callback(null, isPasswordMatch);
    });
}