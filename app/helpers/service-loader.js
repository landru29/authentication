'use strict';
module.exports = function (options, server, done) {
    var loader = require('./loader.js');
    var _ = require('lodash');
    server.services = {};

    server.logger.info(' * Loading services');
    loader(options.folder, '/', function (file) {
        var pattern = file.relativePath.match(/^([A-Z\/\-a-z]*)\.service\.js$/);
        if (pattern) {
            var serviceName = _.capitalize(_.camelCase(pattern[1]))
            server.logger.info('    |-- Loading service ' + serviceName);
            server.services[serviceName] = require(file.completePath)(server);
        }
    }, done);
};