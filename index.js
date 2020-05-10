'use strict';

var exec = require('child_process').exec;
var fs = require('fs');
var crypto = require('crypto');

module.exports = function (opts) {
  var timeout;
  var locked;

  if (!opts) {
    opts = {};
  }
  if (!opts.cmd) {
    throw Error('opts.cmd is required');
  }
  if (!opts.secret) {
    throw new Error('opts.secret is required');
  }
  if (!opts.timeout) {
    opts.timeout = 1000 * 60;
  }
  if (!opts.file) {
    opts.file = '.rebuild';
  }
  if (!opts.execCb) {
    opts.execCb = function () {};
  }
  if (!opts.branch) {
    opts.branch = 'master';
  }

  function makeRebuildTimeout(duration) {
    return setTimeout(function () {
      locked = true;
      var execOpts = {
        env: {
          PATH: process.env.PATH
        },
        shell: true,
        cwd: process.cwd()
      };
      exec(opts.cmd, execOpts, opts.execCb);
    }, duration);
  }

  if (fs.existsSync(opts.file)) {
    timeout = makeRebuildTimeout(0);
    fs.unlinkSync(opts.file);
  }

  return function (req, res) {
    var payload = JSON.stringify(req.body);
    var sig = req.get('X-Hub-Signature');
    var hmac = crypto.createHmac('sha1', opts.secret);
    var digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8');
    var checksum = Buffer.from(sig, 'utf8');
    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
      return res.sendStatus(401);
    }

    if (req.body.ref != 'refs/heads/' + opts.branch) {
      return res.sendStatus(200);
    }

    if (locked && !fs.existsSync(opts.file)) {
      fs.writeFileSync(opts.file);
      return res.sendStatus(200);
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = makeRebuildTimeout(opts.timeout);
    res.sendStatus(200);
  };
};
