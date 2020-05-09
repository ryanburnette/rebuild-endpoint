# rebuild-endpoint

Express.js endpoint for having a rebuild endpoint in your app that takes a
webhook request from Github.

## Options

- `cmd` Rebuild command.
- `secret` The Github secret.
- `timeout` Time to wait between receiving a webhook and starting the rebuild.
  Gets reset if another webhook is received while waiting.
- `file` Path to a file that, if exists, will trigger an immediate rebuild upon
  app start. Handles situation where a rebuild is triggered while one is already
  taking place.

## Usage

```js
app.post(
  '/rebuild',
  require('@ryanburnette/rebuild-endpoint')({
    cmd: 'scripts/build-production',
    secret: '',
    timeout: 1000 * 60 * 2,
    file: '.rebuild'
  })
);
```

## `req.body`

The `req.body` object is presumed to contain the webhook payload object.
