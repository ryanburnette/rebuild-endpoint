# [rebuild-endpoint](https://github.com/ryanburnette/rebuild-endpoint)

[![repo](https://img.shields.io/badge/repository-Github-black.svg?style=flat-square)](https://github.com/ryanburnette/rebuild-endpoint)
[![npm](https://img.shields.io/badge/package-NPM-green.svg?style=flat-square)](https://www.npmjs.com/package/@ryanburnette/rebuild-endpoint)

Express.js endpoint for having a rebuild endpoint in your app that takes a webhook request from
Github.

## Options

- `cmd` Rebuild command. Required.
- `execCb` Callback passed to `exec`. Might want to console log responses from build command.
  Optional.
- `secret` The Github secret. Required.
- `timeout` Time to wait between receiving a webhook and starting the rebuild. Gets reset if another
  webhook is received while waiting. Defaults to `1000 * 60` (one minute).
- `branch` Branch to rebuild for. Defaults to `master`.

## Usage

Works with Express.js. It's expected that your Webhook sends JSON and your app parses a JSON body
posted to the endpoint as `req.body`.

```js
var endpoint = require('@ryanburnette/rebuild-endpoint')({
  cmd: 'scripts/build-production',
  secret: 'secret'
});
app.post('/rebuild', jsonParser, endpoint);
```

## Behavior

- Failed Github verification: `401` do nothing
- Anything other than a push to master: `200` do nothing
- Starting rebuild: `200` start rebuild
- Request a rebuild during the timeout: `200` start the timeout over
- Request once the rebuild has started: `200` rebuild again after restarting
