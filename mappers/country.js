'use strict';
const _ = require('underscore');
exports.toModel = (entity) => {
     const model = {
          currencies: entity.currencies,
          flag: entity.flag,
          name: entity.name,
          callingCodes: entity.callingCodes,
          capital: entity.capital,
     };

     return model;
};

exports.toSearchModel = (entities) => {
     return _.map(entities, exports.toModel);
};
