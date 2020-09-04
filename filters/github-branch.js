'use strict';

module.exports = function (opts) {
  if (!opts.branch) {
    opts.branch = 'master';
  }

  return function (req) {
    return req.body.ref === 'refs/heads/' + opts.branch;
  };
};
