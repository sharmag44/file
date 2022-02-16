'use strict';
let mapper = require('../mappers/user');
let auth = require('../middlewares/authorization');
const updationScheme = require('../helpers/updateEntities');
const userService = require('../services/user');
const _ = require('underscore');
const moment = require('moment');

exports.create = async (req, res) => {
     // let user = await userService.checkUserFromEmailOrFacebookOrUsername(null, null, req.body.username);
     // if(user){ return res.failure("user already exist with this username"); }

     userService.setPassword(req.body.password, async (err, hash) => {
          if (err) {
               return res.failure(err);
          }

          req.body.password = hash;
          req.body.status = 'active';
          req.body.isProfileCompleted = true;
          try {
               let admin = await new db.user(req.body).save();
               return res.data(mapper.toModel(admin));
          } catch (e) {
               return res.failure(e);
          }
     });
};

exports.update = async (req, res) => {
     try {
          let user = await db.user.findByPk(req.params.id);
          if (!user) {
               return res.failure('Oops! User not found');
          }
          if (req.body.firstName && req.body.lastName) {
               req.body.name =
                    req.body.firstName.charAt(0).toUpperCase() +
                    req.body.firstName.slice(1) +
                    ' ' +
                    req.body.lastName.charAt(0).toUpperCase() +
                    req.body.lastName.slice(1);
          }
          if (req.body.firstName && !req.body.lastName) {
               req.body.name =
                    req.body.firstName.charAt(0).toUpperCase() +
                    req.body.firstName.slice(1) +
                    ' ' +
                    user.name.substr(0, user.name.indexOf(' ') + 1);
          }
          if (!req.body.firstName && req.body.lastName) {
               req.body.name =
                    user.name.substr(0, user.name.indexOf(' ')) +
                    ' ' +
                    req.body.lastName.charAt(0).toUpperCase() +
                    req.body.lastName.slice(1);
          }
          if (
               req.body.locationCoordinates &&
               req.body.locationCoordinates.length > 0
          ) {
               req.body.locationCoordinates = {
                    type: 'Point',
                    coordinates: [
                         req.body.locationCoordinates[0],
                         req.body.locationCoordinates[1],
                    ],
               };
          }
          if (req.body.status) {
               if (user.status == 'deleted') {
                    return res.failure('Deleted User cannot be updated');
               }
               if (req.body.status == 'pending') {
                    return res.failure('Not Possible');
               }
          }
          if (req.body.phone && req.body.countryCode) {
               let alreadyPresent = await db.user.findOne({
                    where: { phone: req.body.phone, isPhoneVerified: true },
               });
               if (alreadyPresent) {
                    return res.failure(
                         'Account Already Exists with this Phone Number. Please use a different Phone Number'
                    );
               }
               let code = Math.floor(Math.random() * 9000) + 1000;
               user.activationCode = code.toString();
               user.phone = req.body.phone;
               user.countryCode = req.body.countryCode;
               user.isPhoneVerified = false;
               await user.save();
               sendOTPforPhone(req.body.phone, req.body.countryCode, code);
          }
          if (req.body.email) {
               let alreadyPresent = await db.user.findOne({
                    where: { email: req.body.email, isEmailVerified: true },
               });
               if (alreadyPresent) {
                    return res.failure(
                         'Account Already Exists with this Email. Please use a different Email'
                    );
               }
               let code = Math.floor(Math.random() * 9000) + 1000;
               user.activationCodeEmail = code.toString();
               user.email = req.body.email;
               user.isEmailVerified = false;
               await user.save();
               sendOTPonEmail(req.body.email, code);
          }
          user = updationScheme.update(req.body, user);
          user = await user.save();
          return res.data(mapper.toModel(user));
     } catch (e) {
          return res.failure(e);
     }
};

exports.get = async (req, res) => {
     try {
          let user = await db.user.findOne({
               where: { id: req.params.id },
               include: [
                    {
                         model: db.tier,
                    },
                    {
                         model: db.tierBuilding,
                         include: [db.tierBuildingSmartBox],
                    },
               ],
          });
          if (!user) {
               return res.failure('Oops! User not found');
          }
          let bookings = await db.booking.findAll({
               where: { userId: user.id, state: 'inProgress' },
          });
          user.onGoingJobCount = bookings.length;
          let upcomingBookings = await db.booking.findAll({
               where: { userId: user.id, state: 'upcoming' },
          });
          user.upcomingJobCount = upcomingBookings.length;

          let requestedBookings = await db.booking.findAll({
               where: { userId: user.id, state: 'pending' },
          });
          user.pendingJobCount = requestedBookings.length;
          let completedBooking = await db.booking.find({
               where: { userId: user.id, status: 'completed' },
               include: [{ model: db.providerRating }],
               order: [['id', 'desc']],
          });
          if (completedBooking) {
               if (
                    completedBooking.providerRatings &&
                    completedBooking.providerRatings.length == 0
               ) {
                    user.notRatedBooking = completedBooking;
               }
          }
          user = await user.save();
          return res.data(mapper.toModel(user));
     } catch (e) {
          return res.failure(e);
     }
};

exports.delete = async (req, res) => {
     try {
          let user = await db.user.findByPk(req.params.id);
          if (!user) return res.failure(`Oops! User not found`);
          user.status = 'deleted';
          await user.save();
          return res.success('user deleted successfully ');
     } catch (err) {
          return res.failure(err);
     }
};

exports.search = async (req, res) => {
     let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
     let serverPaging = req.query.serverPaging == 'false' ? false : true;
     let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
     let offset = pageSize * (pageNo - 1);
     let totalRecords = 0;

     let query = {
          include: [],
     };
     if (serverPaging) {
          query.limit = pageSize;
          query.offset = offset;
     }

     let where = {};

     if (req.query.name) {
          where.name = {
               $like: '%' + req.query.name + '%',
          };
     }

     if (req.query.status) {
          where.status = req.query.status;
     } else {
          where.status = 'active';
     }
     if (req.user) {
          where.id = { $ne: req.user.id };
     }
     query.order = [['id', 'DESC']];
     query.where = where;
     db.user.findAll(query).then((users) => {
          db.user
               .findAndCountAll(query)
               .then(async (result) => {
                    return res.page(
                         mapper.toSearchModel(users),
                         pageNo,
                         pageSize,
                         result.count
                    );
               })
               .catch((err) => {
                    res.failure(err);
               });
     });
};
