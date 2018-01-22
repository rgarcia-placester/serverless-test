'use strict';

const bluebird = require('bluebird');

module.exports.helloWorld = (event, context, callback) => {

  console.time('event');

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
      env: process.env,
      context: context
    }, null, 2),
  };

  callback(null, response);

  console.log(event.httpMethod, event.path, response.statusCode, console.timeEnd('event'));

};
