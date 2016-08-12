/*jslint node: true */
/*global q */
var mongoose = require('mongoose');
var Q = require('q');
var db;

var tempDeviceSchema = mongoose.Schema({
    timeStamp: { type: Date, default: Date.now },
    deviceName: String,
    temperature: Number,
    humidity: Number
});

var TemperatureDevice = mongoose.model('TemperatureDevice', tempDeviceSchema);

function saveTemp(data) {
    'use strict';

    var defer = Q.defer(),
        td = new TemperatureDevice(data);

    td.save(function (err, d) {
        if (err) {
            defer.reject('Failed to save temperature:' + err);
        } else {
            defer.resolve(d);
        }
    });

    return defer.promise;
}

function init(dbUrl) {
    'use strict';

    var defer = Q.defer();

    //'mongodb://localhost/test'
    mongoose.connect(dbUrl);

    db = mongoose.connection;

    db.on('error', function (err) {
        defer.reject(err);
    });

    db.once('open', function () {
        defer.resolve(db);
    });

    return {
        connect: function () {
            return defer.promise;
        },
        saveTemp: saveTemp
    };
}

module.exports = init;
