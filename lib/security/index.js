/*jslint node:true */

module.exports = function (params) {
    'use strict';
    var app = params.app;
    var hpkp = require('hpkp');
    //For content security policy
    var builder = require('content-security-policy-builder')
    builder({
        directives: {
            defaultSrc: ["'self'", "localhost"],
            scriptSrc: "localhost"
        }
    });
    //For hiding x-powered by
    var hidePoweredBy = require('hide-powered-by');
    app.use(hidePoweredBy());
    app.use(hidePoweredBy({
        setTo: 'PHP 4.2.0'
    }));

    //For avoiding MITM attack


    var ninetyDaysInMilliseconds = 7776000000;
    app.use(hpkp({
        maxAge: ninetyDaysInMilliseconds,
        sha256s: ['AbCdEf123=', 'ZyXwVu456=']
        //,includeSubdomains: true,         // optional
        //reportUri: 'http://example.com'  // optional
    }));

    var nocache = require('nocache');
    app.use(nocache());

    if (!params.web) {
        var nosniff = require('dont-sniff-mimetype');
        app.use(nosniff());

        var crossdomain = require('helmet-crossdomain');
        app.use(crossdomain());

        var frameguard = require('frameguard');
        app.use(frameguard('deny'));
    }


    var xssFilter = require('x-xss-protection');
    app.use(xssFilter());
}