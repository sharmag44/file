'use strict';
const mapper = require('../mappers/country');
const json = require('../res/countries.json');

exports.get = async (req, res) => {
     try {
          const { name } = req.params;
          let country = json.find(
               (item) => item.name.toLowerCase() === name?.toLowerCase()
          );
          return res.data(mapper.toModel(country));
     } catch (err) {
          res.failure(err);
     }
};

exports.search = async (req, res) => {
     try {
          return res.page(json);
     } catch (error) {
          res.failure(error);
     }
};
