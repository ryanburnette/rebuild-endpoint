# [rebuild-endpoint](https://github.com/ryanburnette/rebuild-endpoint)

[![repo](https://img.shields.io/badge/repository-Github-black.svg?style=flat-square)](https://github.com/ryanburnette/rebuild-endpoint)
[![npm](https://img.shields.io/badge/package-NPM-green.svg?style=flat-square)](https://www.npmjs.com/package/@ryanburnette/rebuild-endpoint)

Express.js endpoint for initiating a rebuild of static assets.

## Options

- `cmd` The rebuild command.
- `execOpts` The opts passed to child_process.exec. Take a look at the source
  for the defaults. Passed options are merged in.
- `execCb` The child_process.exec callback.
  https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
- `timeout` Time to wait between receiving a webhook and starting the rebuild. Gets reset if another
  webhook is received while waiting. Defaults to one minute (`1000 * 60`).
- `filter` A test that must pass for a rebuild to be triggered. This should be a function. Truthy
  returns trigger a rebuild.

## Filters

This endpoint is expected to be the recipient of a webhook for services like
Github. Check `filters/` for useful examples.

## Usage

```js
var express = require('express');
var rebuildEndpoint = require('@ryanburnette/rebuild-endpoint');

var app = express();

app.post(
  '/rebuild',
  express.json(),
  rebuildEndpoint({
    cmd: 'scripts/build-production'
  })
);
```
