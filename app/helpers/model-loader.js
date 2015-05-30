'use strict';

module.exports = function (options, server, done) {
    var loader = require('./loader.js');
    var _ = require('lodash');
    server.models = {};
    
    server.logger.info(' * Loading models');
    loader(options.folder, '/', function (file) {
        var pattern = file.relativePath.match(/^([A-Z\/\-a-z]*)\.model\.js$/);
        if (pattern) {
            var modelName = _.capitalize(_.camelCase(pattern[1]));
            server.logger.info('    |-- Loading model ' + modelName);
            server.models[modelName] = require(file.completePath)({
                mongoose: server.db
            });
        }
    }, done);

};