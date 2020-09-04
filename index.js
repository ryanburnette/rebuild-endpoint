'use strict';

var exec = require('child_process').exec;
var fs = require('fs');
var merge = require('lodash/merge');

module.exports = function (opts = {}) {
  if (!opts.cmd) {
    throw Error('opts.cmd is required');
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
  if (!opts.filter) {
    opts.filter = function () {
      return true;
    };
  }

  var execOpts = {
    env: {
      PATH: process.env.PATH
    },
    shell: true,
    cwd: process.cwd()
  };
  merge(execOpts, opts.execOpts || {});

  var locked, timeout;
  function makeRebuildTimeout(duration) {
    timeout = setTimeout(function () {
      locked = true;
      exec(opts.cmd, opts.execOpts, opts.execCb);
    }, duration);
  }

  if (fs.existsSync(opts.file)) {
    fs.unlinkSync(opts.file);
    makeRebuildTimeout(0);
  }

  return function (req, res) {
    if (!opts.filter(req)) {
      return res.sendStatus(400);
    }
    if (locked) {
      if (!fs.existsSync(opts.file)) {
        fs.writeFileSync(opts.file);
      }
    } else {
      if (timeout) {
        clearTimeout(timeout);
      }
      makeRebuildTimeout(opts.timeout);
    }
    res.sendStatus(200);
  };
};
