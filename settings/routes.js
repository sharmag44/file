'use strict';
const apiRoutes = require('../helpers/apiRoute');
var auth = require('../middlewares/authorization');
var authNew = require('../middlewares/auth');

module.exports.configure = (app) => {
     app.get('/', (req, res) => {
          res.render('index', {
               title: 'Sample API',
          });
     });
     app.get('/api', (req, res) => {
          res.render('index', {
               title: 'Sample API',
          });
     });

     let api = apiRoutes(app);

     api.model('users').register([
          {
               action: 'POST',
               method: 'create',
          },
          {
               action: 'PUT',
               method: 'update',
               url: '/:id',
          },
          {
               action: 'GET',
               method: 'get',
               url: '/:id',
          },
          {
               action: 'GET',
               method: 'search',
          },
          {
               action: 'DELETE',
               method: 'delete',
               url: '/:id',
          },
     ]);

     api.model('auths').register([
          {
               action: 'POST',
               method: 'signUp',
               url: '/signup',
          },
          {
               action: 'POST',
               method: 'signin',
               url: '/signin',
          },
          {
               action: 'POST',
               method: 'verification',
               url: '/verify',
          },
          {
               action: 'POST',
               method: 'forgotPassword',
               url: '/forgotPassword',
          },
          {
               action: 'POST',
               method: 'resend',
               url: '/resend',
          },

          {
               action: 'POST',
               method: 'refreshToken',
               url: '/refresh/token',
               filter: authNew.validateRefreshToken,
          },
     ]);

     api.model('countries').register([
          {
               action: 'GET',
               method: 'get',
               url: '/:name',
          },
          {
               action: 'GET',
               method: 'search',
          },
     ]);
};
