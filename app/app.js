'use strict';

var Server = function () {
  var express = require('express');
  var _ = require('lodash');
  var self = this;
  this.logger = require('bunyan').createLogger({name: 'server'});

  // Load configuration
  this.config = require('./config.json');
  require('extend')(this.config, require('./authentication.json'));

  // Initialize database
  this.db = new require('./helpers/mongoose-connection.js')(this.config.mongoose);
  require('./helpers/model-loader.js')({folder: __dirname + '/models' }, this);

  // Initialize the API
  this.logger.info('** Initialize Express **');
  this.app = express();

  // Load middlewares
  this.app.use(require('cookie-parser')(this.config.cookie.secret));
  this.app.use(require('body-parser').json());

  // Loading routes
  require('./helpers/route-loader.js')({folder: __dirname + '/routes' }, this);

  // Express application is ready
  this.logger.info('** Express is ready **');
  this.logger.info('Log format: level date [process PID] (request UUID) message');
};


// Export the module
module.exports = Server;
