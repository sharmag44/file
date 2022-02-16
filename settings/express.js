'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

module.exports.configure = (app) => {
 
    app.use(function (err, req, res, next) {
        if (err) {
            (res.log || log).error(err.stack);
            if (req.xhr) {
                res.send(500, { error: 'Something went wrong!' });
            } else {
                next(err);
            }

            return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    });

    app.use(cors());

    // app.use(express.static(__dirname + '/api/uploads'))

    // app.use(require('morgan')("combined",{ "stream": logger.stream }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    })); 
    app.use(bodyParser({ limit: '50mb', keepExtensions: true }));

    app.use(cookieParser())

    app.set('view engine', 'ejs');    
    const root = path.normalize(__dirname + './../');
    app.set('views', path.join(root, 'views'));

    app.use(express.static(path.join(root, 'uploads')));
    app.use(express.static(path.join(root, 'public')));
    
};