
module.exports = (function() {
    'use strict';

    var e = require('./exceptions');

    var h = {};

    h.throwBadParamsIfEmpty = function throwBadParamsIfEmpty(msg) {
        msg = msg || 'Params cannot be empty';

        return function(result) {
            if (!result || result.length === 0) throw new e.BadParams(msg);

            return result;
        };
    };

    h.throwNotFoundErrorIfEmpty = function throwNotFoundErrorIfEmpty(msg) {
        msg = msg || 'Not found';

        return function(result) {
            if (!result || result.length === 0) throw new e.NotFound(msg);

            return result;
        };
    };

    h.throwBadParamIfError = function throwBadParamIfError(err) {
        return function(err) {
            throw new e.BadParams(err.message);
        };
    };

    h.handleOk = function handleOk(statusCode, mapper) {
        statusCode = statusCode || 200;

        return function(result) {
            result = (typeof mapper == 'function') ? mapper(result) : result;
            return {statusCode: statusCode, body: result};
        };
    };

    h.handleNotFoundError = function handleNotFoundError() {
        return e.isException(e.NotFound, function(err) {
            return {statusCode: 404};
        });
    };

    h.handleUnauthorizedError = function handleUnauthorizedError() {
        return e.isException(e.Unauthorized, function (err){
            return {statusCode: 401, body: {message: err.message}};
        });
    };

    h.handleForbiddenError = function handleForbiddenError() {
        return e.isException(e.Forbidden, function (err){
            return {statusCode: 403, body: {message: err.message}};
        });
    };

    h.handleBadParamsError = function handleBadParamsError() {
        return e.isException(e.BadParams, function(err) {
            return {statusCode: 400, body: {status: 'error', response: err.message}};
        });
    };

    h.handleValidationError = function handleValidationError() {
        return e.isException('ValidationError', function(err) {
            console.error(err.toString());
            return {statusCode: 400, body: {status: 'error', response: err.message}};
        });
    };

    h.handleError = function handleError() {
        return function(err) {
            return {statusCode: err.statusCode || 500, body: {message: err.message}};
        };
    };

    h.sendResponse = function sendResponse(cb) {
        return function(result) {

            result.statusCode = result.statusCode || 200;
            result.headers    = result.headers    || {};
            result.body       = JSON.stringify(result.body, null, 2)

            cb(null, result);
        };
    };

    h.Authentication = function Authentication(cb) {
        return function (req) {
            if (!cb(req)) throw new e.Unauthorized('Unauthorized')
            return req
        }
    }
    
    h.Authentication.allowAll = function (req) {
        return true;
    }
    
    h.Authentication.denyAll = function (req) {
        return false;
    }
    
    h.Authorization = function Authorization(cb) {
        return function (req) {
            if (!cb(req)) throw new e.Forbidden('Forbidden')
            return req
        }
    }
    
    h.Authorization.allowAll = function (req) {
        return true;
    }
    
    h.Authorization.denyAll = function (req) {
        return false;
    }
    

    return h;
}());
