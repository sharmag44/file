'use strict';
const dbConfig = require('config').get('db');
global.Sequelize = require('sequelize');

module.exports.configure =  () => {
    const sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        {
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: dbConfig.dialect,
            logging: false,
        }
    );
    global.sequelize = sequelize;
    global.db = require('../models');

    sequelize.sync({ alter: false }).then(() => {
        console.log('db connected');
    }).catch(function(err) {
        console.log(err);
        console.log('DB Connection Failed');
    });
};

