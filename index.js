'use strict';

var exec = require('child_process').exec;
var fs = require('fs');

module.exports = function (opts) {
  if (!opts) {
    opts = {};
  }
  if (!opts.timeout) {
    opts.timeout = 1000 * 60;
  }
  if (!opts.file) {
    opts.file = '.rebuildagain';
  }
  if (!opts.cmd) {
    throw Error('opts.cmd is required');
  }

  var timeout;
  var locked;

  return function (req, res) {
    // TODO make sure it's legit from github
var hash = req.headers["X-GITHUBWHATEVER"].replace(/^sha1:/, '');
var secrethash = crypto.createHash('sha1').update("foo").digest();
if (crypto.constantTimeCompare(hash, secrethash)) {
console.log('fail')
  return false;
}
    // TODO make sure it's a commit to master, so i can update branches without rebuilding
    // if (req.body.refs != 'refs/heads/master') {
    //   return res.sendStatus(200);
    // }
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

  function makeRebuildTimeout(duration) {
    return setTimeout(function () {
      locked = true;
      exec(opts.cmd, {
        env: {
          PATH: process.env.PATH
        },
        shell: true,
        cwd: process.cwd()
      });
    }, duration);
  }

  if (fs.existsSync(opts.file)) {
    timeout = makeRebuildTimeout(0);
    fs.unlinkSync(opts.file);
  }
};
