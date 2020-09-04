'use strict';

var getBearerToken = require('@ryanburnette/get-bearer-token');

module.exports = function (req) {
  var token = getBearerToken(req);
  return token === process.env.REBUILD_TOKEN;
};
