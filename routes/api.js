/*jslint node: true */
module.exports = function (db) {
    'use strict';

    var express = require('express'),
        router = express.Router();

    /* GET users listing. */
    router.get('/temperature/:name/:temperature/:humidity', function (req, res) {
        var params = req.params,
            result = {
                status: false,
                msg: ''
            };

        db.saveTemp({
            deviceName: params.name,
            temperature: params.temperature,
            humidity: params.humidity
        }).then(function (d) {
            result.status = true;
            result.msg = 'success';
            res.send(JSON.stringify(result));
        }, function (err) {
            result.msg = err;
            console.error('Error saving temp:' + err);
            res.send(JSON.stringify(result));
        });
    });

    return router;
};
