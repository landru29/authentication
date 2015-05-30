'use strict';

var Server = function () {
    var express = require('express');
    var _ = require('lodash');
    var q = require('q');
    var self = this;
    this.logger = require('bunyan').createLogger({
        name: 'server'
    });

    var serviceLoaderDefer = q.defer();
    var modelLoaderDefer = q.defer();
    var routeLoaderDefer = q.defer();

    // Load configuration
    this.config = require('./config.json');
    require('extend')(this.config, require('./authentication.json'));

    // Initialize database
    this.db = new require('./helpers/mongoose-connection.js')(this.config.mongoose);
    require('./helpers/model-loader.js')({
        folder: __dirname + '/models'
    }, this, function(){
        modelLoaderDefer.resolve();
        self.logger.info(' ** Models are loaded **');
    });

    // Initialize the services
    require('./helpers/service-loader.js')({
        folder: __dirname + '/services'
    }, this, function(){
        serviceLoaderDefer.resolve();
        self.logger.info(' ** Services are loaded **');
    });

    // Initialize the API
    this.logger.info('**** Initializing Express ****');
    this.app = express();

    // Load middlewares
    this.app.use(require('cookie-parser')(this.config.cookie.secret));
    this.app.use(require('body-parser').json());

    // Loading routes
    require('./helpers/route-loader.js')({
        folder: __dirname + '/routes'
    }, this, function(){
        routeLoaderDefer.resolve();
        self.logger.info(' ** Routes are loaded **');
    });

    q.all(
        [
            serviceLoaderDefer.promise, 
            routeLoaderDefer.promise, 
            modelLoaderDefer.promise
        ]
    ).then(
        function () {
            // Express application is ready
            self.logger.info('  **************************');
            self.logger.info('  **** Express is ready ****');
            self.logger.info('  **************************');
        },
        function (err) {
            throw err;
        });
};


// Export the module
module.exports = Server;