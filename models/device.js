'use strict';
module.exports = () => {
    var device = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        deviceId: {
            type: Sequelize.STRING
        },
        deviceType: {
            type: Sequelize.ENUM,
            values: ['web', 'android', 'ios'],
            allowNull: false,
        }
    };
    return sequelize.define('device', device);
};