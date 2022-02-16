'use strict';

const crypto = require('crypto');
const _ = require('underscore');
const config = require('config').get('payu_paisa');
const asiTicketConfig = require('config').get('asi-ticketing');
const logger = require('@open-age/logger')('crypto');


const hashingLogic = (txt) => {
    var sha512 = crypto.createHash('sha512');
    sha512.update(txt, 'utf8');
    return sha512.digest('hex');
};

const calculateHash =  (details, isSending) => {
    logger.start('calculateHash');
    var hashString = '';

    if(!isSending) {
        hashString += details.additionalCharges || '23.44';
        hashString = hashString + '|';
        hashString += config.salt; // appending SALT
        hashString = hashString + '|';
        hashString += details.status;
    }


    var hashVarsSeq = (isSending? config.hashSequence.send:config.hashSequence.recieved).split('|');

    _.each(hashVarsSeq, (hashParam) => { //creating hashString with values//
        switch (hashParam) {
            case 'key':
                hashString = hashString + config.key + '|';
                break;
            case 'txnid':
                hashString = hashString + details.code + '|';
                break;
            case 'amount':
                hashString = hashString + details.amount + '|';
                break;
            case 'productinfo':
                hashString = hashString + (details.productInfo || config.productInfo) + '|';
                break;
            case 'firstname':
                hashString = hashString + (details.firstName || '') + '|';
                break;
            case 'email':
                hashString = hashString + (details.email || '') + '|';
                break;

            case 'udf1': 
                hashString = hashString + (details.udf1 === undefined ? '': details.udf1) + '|';
                break;

            case 'udf2':
                hashString = hashString + (details.udf2 === undefined ? '': details.udf2) + '|';
                break;

            case 'udf3':
                hashString = hashString + (details.udf3 === undefined ? '': details.udf3) + '|';
                break;

            case 'udf4':
                hashString = hashString + (details.udf4 === undefined ? '': details.udf4) + '|';
                break;

            case 'udf5':
                hashString = hashString + (details.udf5 === undefined ? '': details.udf5) + '|';
                break;

            default:
                hashString = hashString + ([hashParam] !== null ? [hashParam] : '') + '|'; // isset if else
        }
    });

    if(isSending) {
        hashString += config.salt; // appending SALT
    }

    logger.debug('hash string - ' + hashString);
    const sha = hashingLogic(hashString).toLowerCase();
    logger.debug('hash sha - ' + sha);

    return sha; //generating hash
};

// code, productInfo, firstName, email, amount


exports.getHashSync = (details) => {
    return calculateHash(details, true);
};

exports.validateHash = (paymentDetails) => {

     logger.start('validateHash');
     var hash = calculateHash(paymentDetails, false);

     if(paymentDetails.hash !== hash) {
         logger.info('hash mismatch', {
             recievedHash: paymentDetails.hash,
             calculatedHash: hash
         });

         return false;
     }

    return true ;
};

exports.dataPiping = (details) =>{
    logger.start('dataPiping')
    let hashString = '';     
    const hashVarsSeq = (typeof (details) === 'string' ? asiTicketConfig.hashSequence.paymentId: details.transactionId ? asiTicketConfig.hashSequence.send:asiTicketConfig.hashSequence.visitor).split('|');
    _.each(hashVarsSeq,  (hashParam) => { //creating hashString with values//
        switch (hashParam) {
            case 'api-key':
                hashString = hashString + asiTicketConfig['api-key'] + '|';
                break;
            case 'payment.amount':
                hashString = hashString + details.amount + '|';
                break;
            case 'payment.transactionId':
                hashString = hashString + details.transactionId + '|';
                break;
            case 'payment.id':
                hashString = hashString + (details.id || asiTicketConfig.productInfo) + '|';
                break;
            case 'payment.provider':
                hashString = hashString + (details.provider || '') + '|';
                break;
            case 'payment.gateway':
                hashString = hashString + (details.gateway || '') + '|';
                break;
            case 'payment.date': 
                hashString = hashString + (details.date === undefined ? '': details.date) + '|';
                break;
            case 'monument.code':
                hashString = hashString + (details.monument.code === undefined ? '': details.monument.code) + '|';
                break;
            case 'date':
                hashString = hashString + (details.date === undefined ? '': details.date) + '|';
                break;
            case 'identity.type':
                hashString = hashString + (details.identity.type === undefined ? '': details.identity.type) + '|';
                break;
            case 'identity.no':
                hashString = hashString + (details.identity.no === undefined ? '': details.identity.no) + '|';
                break;               
            case 'age':
                hashString = hashString + (details.age === undefined ? '': details.age) + '|';
                break;            
            case 'country':
                hashString = hashString + (details.nationality.country === undefined ? '': details.nationality.country) + '|';
                break;            
            case 'amount':
                hashString = hashString + (details.amount === undefined ? '': details.amount) + '|';
                break;            
            case 'visitorId':
                hashString = hashString + (details.visitorId === undefined ? '' : details.visitorId) ;
                break;  
            case 'paymentId':
                hashString = hashString +  details  + '|';
                break;         
                                
            default:
                hashString = hashString + ([hashParam] !== null ? [hashParam] : '') + ''; 
        }
    });
    return hashString;
}

exports.ticketingApiHash =  (details) => {
    logger.start('ticketingApiHash'); 
    details += asiTicketConfig['api-salt']; // appending SALT  

    logger.debug('hash string - ' + details);
    const sha = hashingLogic(details).toLowerCase();
    logger.debug('hash sha - ' + sha);

    return sha; //generating hash
};
