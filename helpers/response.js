'use strict';
module.exports = function(res) {
    return {
        success: function(message, code) {
            var val = {
                isSuccess: true,
                message: message,
                code: code
            };
            res.log.info(message || 'success', val);
            res.json(val);
        },
        failure: function(error, message) {
            // res.status(error.status || 400);
            var val = {
                isSuccess: false,
                message: message,
                error: error.stack || error.message || error
            };
            res.log.error(message || 'failed', val);
            res.json(val);
        },
        data: function(item, message, code) {
            var val = {
                isSuccess: true,
                message: message,
                data: item,
                code: code
            };
            res.log.info(message || 'success', val);
            res.json(val);
        },
        
        page: function(items, pageNo, pageSize, totalRecords) {

            if (!pageSize)
                pageSize = items.length;

            var val = {
                isSuccess: true,
                items: items,
                total: items.length,
                pageNo: pageNo || 1,
                pageSize: items.length > pageSize ? items.length : pageSize,
                totalRecords: totalRecords || items.length
            };

            res.log.info('page', val);
            res.json(val);
        },
        pageWithPaging: function(items, pageNo, pageSize, totalRecords) {

            if (!pageSize)
                pageSize = items.length;

            var val = {
                isSuccess: true,
                items: items,
                total: items.length,
                pageNo: pageNo || 1,
                pageSize: items.length > pageSize ? items.length : pageSize,
                totalRecords: totalRecords || items.length
            };

            res.log.info('page', val);
            res.json(val);
        }
       };
};