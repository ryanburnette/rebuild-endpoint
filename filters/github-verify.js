'use strict';

var crypto = require('crypto');

module.exports = function (opts) {
  if (!opts.secret) {
    throw new Error('opts.secret is required');
  }

  return function (req) {
    var payload = JSON.stringify(req.body);
    var sig = req.get('X-Hub-Signature');
    var hmac = crypto.createHmac('sha1', opts.secret);
    var digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8');
    var checksum = Buffer.from(sig, 'utf8');
    return checksum.length === digest.length && crypto.timingSafeEqual(digest, checksum);
  };
};
