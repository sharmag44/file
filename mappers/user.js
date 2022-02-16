'use strict';
const _ = require('underscore');
let auth = require('../middlewares/authorization');

exports.toModel = (entity) => {
    const model = {
        id: entity.id,
        firstName: entity.firstName,
        lastName: entity.lastName,
        email: entity.email,
        phone: entity.phone,
        imgUrl: entity.imgUrl,
        isEmailVerified: entity.isEmailVerified,
        isPhoneVerified: entity.isPhoneVerified,
        status: entity.status
    }
    return model;
};
   
exports.toSearchModel = entities => {
    return _.map(entities, exports.toModel);
};

exports.toAuthModel = (entity) => {
    let model = exports.toModel(entity);
    model.token = entity.token;
    return model;
};