/*jslint node: true */
module.exports = function (db) {
    'use strict';

    var express = require('express'),
        router = express.Router(),
        moment = require('moment');

    function listRequestHandler(req, res, startTime, endTime) {
        var params = req.params,
            result = {
                status: false,
                msg: ''
            },
            TemperatureDevice = new db.models.TemperatureDevice(),
            callback = function (err, docs) {
                if (err) {
                    result.msg = err;
                    res.jsonp(result);
                } else {
                    result.status = true;
                    result.data = docs;
                    res.jsonp(result);
                }
            };

        TemperatureDevice.find({
            deviceName: params.deviceName,
            timeStamp: {
                $gte: startTime.toDate(),
                $lte: endTime.toDate()
            }
        })
            .sort({timeStamp: 1})
            .exec(callback);
    }

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
            res.jsonp(result);
        }, function (err) {
            result.msg = err;
            console.error('Error saving temp:' + err);
            res.jsonp(result);
        });
    });

    router.get('/list/temperature/hour/:deviceName', function (req, res) {
        var endTime = moment().startOf('hour'),
            startTime = moment().startOf('hour').subtract(1, 'hours');

        listRequestHandler(req, res, startTime, endTime);
    });

    router.get('/list/temperature/day/:deviceName', function (req, res) {
        var endTime = moment().startOf('day'),
            startTime = moment().startOf('day').subtract(1, 'days');

        listRequestHandler(req, res, startTime, endTime);
    });

    return router;
};
