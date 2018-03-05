/*jslint node:true*/

module.exports = (function() {
    'use strict';

    var util = require('util');

    function isException(expected, cb) {
        return function (actual) {
            if (typeof expected === 'function' && actual instanceof expected) {
                return cb(actual);
            }

            if (expected instanceof RegExp && expected.test(actual.message)) {
                return cb(actual);
            }

            if (actual.name == expected) {
                return cb(actual);
            }

            if (actual.message == expected) {
                return cb(actual);
            }

            throw actual;
        };
    }

    function BadParams(message) {
        this.name    = 'BadParams';
        this.message = message;
    }
    util.inherits(BadParams, Error);


    function NotFound(message) {
        this.name    = 'NotFound';
        this.message = message;
    }
    util.inherits(NotFound, Error);


    function Unauthorized(message) {
        this.name    = 'Unauthorized';
        this.message = message;
    }
    util.inherits(Unauthorized, Error);


    function Forbidden(message) {
        this.name    = 'Forbidden';
        this.message = message;
    }
    util.inherits(Unauthorized, Error);


    function Http(message, statusCode, body) {
        this.name    = 'HttpError';
        this.message = message || '';
        this.statusCode = statusCode || 504;
        this.body = body || '';

        this.message += util.format(' [statusCode: %s] [body: %s]', this.statusCode, JSON.stringify(this.body));
    }
    util.inherits(Http, Error);

    function throwError(e) {
        return function() {
            throw e;
        };
    }
    
    return {
        isException: isException,
        throwError: throwError,

        BadParams: BadParams,
        NotFound: NotFound,
        Unauthorized: Unauthorized,
        Forbidden: Forbidden,
        Http: Http
    };
}());
