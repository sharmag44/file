'use strict';
module.exports = () => {
     var user = {
          id: {
               type: Sequelize.UUID,
               primaryKey: true,
               autoIncrement: true,
               unique: true,
          },
          firstName: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          lastName: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          phone: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          email: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          password: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          refreshToken: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          googleId: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          facebookId: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          appleId: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          isEmailVerified: {
               type: Sequelize.BOOLEAN,
               defaultValue: false,
          },
          isPhoneVerified: {
               type: Sequelize.BOOLEAN,
               defaultValue: false,
          },
          emailVerfiicationCode: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          phoneVerfiicationCode: {
               type: Sequelize.STRING,
               allowNull: true,
               defaultValue: null,
          },
          status: {
               type: Sequelize.ENUM,
               values: ['pending', 'active', 'inactive', 'blocked', 'deleted'],
               defaultValue: 'pending',
          },
     };
     return sequelize.define('user', user);
};
