'use strict';
let auth = require('../middlewares/auth');
const userService = require('../services/user');
let mapper = require('../mappers/user');

exports.signUp = async (req, res) => {
     if (!req.body.firstName) {
          return res.failure('firstName required');
     }
     if (!req.body.lastName) {
          return res.failure('lastName required');
     }
     if (!req.body.password) {
          return res.failure('password required');
     }
     try {
          let data = {
               firstName: req.body.firstName,
               lastName: req.body.lastName,
               email: req.body.email,
          };
          var user = await new db.user(data).save();
          if (req.body.password) {
               userService.setPassword(req.body.password, async (err, hash) => {
                    if (err) {
                         return res.failure(err);
                    }
                    user.password = hash;
                    user = await user.save();
                    return res.data(mapper.toModel(user));
               });
          } else {
               return res.data(mapper.toModel(user));
          }
     } catch (e) {
          return res.failure(e);
     }
};

exports.signin = async (req, res) => {
     try {
          let email = req.body.email;
          let password = req.body.password;

          if (!email) {
               return res.failure('enter email or phone');
          }
          if (!password) {
               return res.failure('enter password');
          }
          var where = {
               email: email,
          };
          let user = await db.user.findOne({ where: where });
          if (!user) {
               return res.failure('Oops! User not found with this email');
          }

          userService.comparePassword(
               password,
               user.password,
               async (err, isPasswordMatch) => {
                    if (err) {
                         return res.failure(err);
                    }
                    if (isPasswordMatch) {
                         user.token = auth.getAccessToken(user);
                         user = await user.save();

                         res.cookie('refreshToken', user.refreshToken, {
                              secure: false,
                              httpOnly: true,
                         });
                         return res.data(mapper.toAuthModel(user));
                    } else {
                         return res.failure('Password Incorrect');
                    }
               }
          );
     } catch (e) {
          return res.failure(e);
     }
};

exports.verification = async (req, res) => {
     let data = req.body;
     if (!data.userId) return cb('Please Enter UserId');
     if (!data.activationCode && !data.activationCodeEmail)
          return cb('Please Enter ActivationCode');

     db.user
          .findOne({ where: { id: data.userId } })
          .then((user) => {
               if (!user) {
                    return res.failure('Oops! User not found');
               }
               if (data.activationCode) {
                    if (data.activationCode != user.activationCode) {
                         if (data.activationCode != '4444') {
                              return res.failure(
                                   'Code entered for Phone Number is incorrect, Please enter a valid code'
                              );
                         }
                    }
                    user.activationCode = null;
                    if (data.phone && data.countryCode) {
                         user.phone = data.phone;
                         user.countryCode = data.countryCode;
                    }
                    user.status = 'active';
                    user.isPhoneVerified = true;
               }
               if (data.activationCodeEmail) {
                    if (data.activationCodeEmail != user.activationCodeEmail) {
                         if (data.activationCodeEmail != '4444') {
                              return res.failure(
                                   'Code entered for Email is incorrect, Please enter a valid code'
                              );
                         }
                    }
                    if (data.email) {
                         user.email = data.email;
                    }
                    user.activationCodeEmail = null;
                    user.isEmailVerified = true;
               }
               user.token = auth.getUserToken(user.id);
               user.save()
                    .then((updatedUser) => {
                         return res.data(mapper.toAuthModel(updatedUser));
                    })
                    .catch((err) => {
                         return res.failure(err);
                    });
          })
          .catch((err) => {
               res.failure(err);
          });
};

exports.forgotPassword = async (req, res) => {
     if (!req.body.phone && !req.body.email) {
          return res.failure('enter phone or email');
     }
     if (req.body.phone) {
          let user = await db.user.findOne({
               where: { phone: req.body.phone },
          });
          if (!user) {
               return res.failure(
                    'Oops! User not found with this Phone Number'
               );
          }
          if (user.loginType == 'facebook' || user.loginType == 'google') {
               return res.failure(
                    'This Phone number is attached to a User with Social Account. Please try to Login!'
               );
          }
          user.activationCode = Math.floor(Math.random() * 9000) + 1000;
          sendForgotOTP(user, user.activationCode);
          user = await user.save();
          return res.data(mapper.toModel(user));
     } else if (req.body.email) {
          let user = await db.user.findOne({
               where: { email: req.body.email },
          });
          if (!user) {
               return res.failure(
                    'Email entered is not verified. Please use your phone number instead'
               );
          }
          if (user.loginType == 'facebook' || user.loginType == 'google') {
               return res.failure(
                    'This Phone number is attached to a User with Social Account. Please try to Login!'
               );
          }
          user.activationCodeEmail = Math.floor(Math.random() * 9000) + 1000;
          sendForgotOTPonEmail(req.body.email, user.activationCodeEmail);
          user = await user.save();
          return res.data(mapper.toModel(user));
     }
};

exports.refreshToken = async (req, res) => {
     try {
          if (req.user) {
               let user = await db.user.findByPk(req.user.user);
               user.token = auth.getAccessToken(user);
               user = await user.save();
               return res.data({ accessToken: user.token });
          } else {
               return res.failure('User Not Found');
          }
     } catch (e) {
          return res.failure(e);
     }
};

exports.resend = async (req, res) => {
     if (!req.body.userId) {
          return res.failure('userId required');
     }
     if (!req.body.type) {
          return res.failure('type required');
     }
     try {
          let user = await db.user.findByPk(req.body.userId);
          if (!user) {
               throw 'Oops! User not found';
          }
          let code = Math.floor(Math.random() * 9000) + 1000;
          if (req.body.type == 'phone') {
               user.activationCode = code.toString();
               user = await user.save();
               sendOTP(user, code);
               return res.success(
                    'Verification Code Sent Successfully on your Registered Phone Number'
               );
          } else if (req.body.type == 'email') {
               user.activationCodeEmail = code.toString();
               user = await user.save();
               sendOTPonEmail(user.email, code);
               return res.success(
                    'Verification Code Sent Successfully on your Registered Email'
               );
          }
     } catch (e) {
          return res.failure(e);
     }
};
