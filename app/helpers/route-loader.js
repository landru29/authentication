'use strict';
module.exports = function (options, server, done) {
    var loader = require('./loader.js');

    server.logger.info(' * Loading routes');
    loader(options.folder, '/', function (file) {
        var routeMatcher = file.relativePath.match(/^([A-Z\/\-a-z]*)\.route\.js$/);
        if (routeMatcher) {
            var route = routeMatcher[1];
            server.logger.info('    |-- Loading route ' + route);
            server.app.use(
                route,
                require(file.completePath)(server)
            );
        }
    }, done);

};