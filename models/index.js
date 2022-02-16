'use strict';
const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);

let initModels = () => {
    let db = {};
    fs.readdirSync(__dirname)
        .filter((file) => {
            return (file.indexOf('.') !== 0) && (file !== basename);
        })
        .forEach((file) => {
            const model = require(path.join(__dirname, file))(sequelize, Sequelize)
            db[model.name] = model;
            // model.sync({ alter: true });
        });

    db.user.hasOne(db.device);
    db.device.belongsTo(db.user);

    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db)
          }
    });
    return db;
};
module.exports = initModels();