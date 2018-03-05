'use strict';

const Promise    = require('bluebird');
const helpers    = require('./src/helpers');
const exceptions = require('./src/exceptions');


module.exports.helloWorld = (event, context, callback) => {

  Promise
  .resolve(event)
  //.then(exceptions.throwError(new exceptions.NotFound()))
  //.then(exceptions.throwError(new exceptions.Http('Unspected Fail', 500)))
  .then(helpers.Authentication(helpers.Authentication.allowAll))
  .then(helpers.Authorization(helpers.Authorization.allowAll))
  .then(function handler(req) {
    return {
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: req,
      env: process.env,
      context: context
    }
  })
  .then(helpers.handleOk())
  .catch(helpers.handleNotFoundError())
  .catch(helpers.handleUnauthorizedError())
  .catch(helpers.handleForbiddenError())
  .catch(helpers.handleError())
  .then(helpers.sendResponse(callback))
};
