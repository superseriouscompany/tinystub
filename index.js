'use strict';

const express    = require('express');
const bodyParser = require('body-parser');
const debug      = require('debug')('tinystub');
const app        = express();

let calls = [];

app.use(bodyParser.json());

app.delete('/', function(req, res) {
  calls = [];
  return res.sendStatus(204);
})

app.use('*', function(req, res) {
  debug(req.originalUrl, req.body);
  const status = req.query.status || 200;
  calls.unshift({url: req.originalUrl, body: req.body});
  if( !req.body || !Object.keys(req.body).length ) { return res.sendStatus(status); }
  return res.status(status).json(req.body);
})

module.exports = function(port) {
  const server = app.listen(port);
  let handle   = server.close.bind(server);
  Object.defineProperty(handle, 'calls', { get: function() { return calls } });
  return handle;
}
