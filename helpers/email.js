'use strict';

const logger = require('@open-age/logger')('helper/email');
const emailClient = require('../providers/' + require('config').email.provider);
const rolesConfig = require('config').roles;

exports.sendTicket = (to, paymentNo, callback) => {
    logger.start('sendTicket');
    var mailOptions = {
        from: 'websiteasi@gmail.com',
        to: to,
        subject: 'E-Ticket',
        html: 'Dear Customer,<br>' +
            '<p>Warm greetings!</p><p>Thank you for your interest in booking e-ticket.</p>' +
            '<p>Click <a href="http://asi-qa-test.m-sas.com/api/v4/payments/' + paymentNo + '.pdf"> here </a> to get your ticket. You need Adobe Acrobat Reader 6.0 or above to open the file.</p>' +
            '<p>Should you have any queries, please do not hesitate to email us at care@payumoney.com.</p><br>' +
            'Best Regards,<br>' +
            'PayUMoney Team'         
    };

    if (callback) {
        emailClient.send(mailOptions, callback);
        logger.info('Sending Email');
    } else {
        emailClient.send(mailOptions);
        logger.info('Sending Email');
    }
};


exports.notifyErrorToAdmin = (location, message) => {
    if(!message){
        message = location;
        location = null;
    }
    emailClient.send({
        from: rolesConfig.owner.email,
        to: rolesConfig.admin.email,
        subject: 'Error occured at ASI Site' +  (location? ' at:' + location: ''),
        html: message        
    });
};