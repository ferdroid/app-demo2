const Express = require('express');
const Cors = require('cors');
const BodyParser = require('body-parser');

const Http = require('http');
const __port = 2002;

const App = Express();
App.use(Cors({ origin: 'http://localhost:3000', credentials: true }));
App.use(BodyParser.json({ limit: '10mb' }));
App.use(BodyParser.urlencoded({ extended: true }));

/*** ***/
const bffSecurity = require('./controllers/bff-security.controller');
/*** ***/

App.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});

const Server = Http.createServer(App);
Server.listen(__port, () => {
  console.log('+-----\n mock-server listening on port ' + __port + '...\n+-----');
});
