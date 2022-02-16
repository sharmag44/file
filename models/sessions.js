'use strict';
module.exports = () => {
     var model = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        accessToken: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        fcmToken: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        deviceType: {
            type: Sequelize.ENUM,
            values: ['web', 'android', 'ios'],
            defaultValue: null,
        },
        deviceId: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        }
     };

     return sequelize.define('session', model);
};
