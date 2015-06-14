'use strict';

module.exports = function (options, server, done) {
    var loader = require('./loader.js');
    var _ = require('lodash');
    var models = {};
    server.model = function(modelName) {
        return models[modelName];
    };
    
    server.logger.info(' * Loading models');
    loader(options.folder, '/', function (file) {
        var pattern = file.relativePath.match(/^([A-Z\/\-a-z]*)\.model\.js$/);
        if (pattern) {
            var modelName = _.capitalize(_.camelCase(pattern[1]));
            server.logger.info('    |-- Loading model ' + modelName);
            var schema = require(file.completePath)({
                mongoose: server.db
            });
            models[modelName] = server.db.model(modelName, schema);
        }
    }, done);

};