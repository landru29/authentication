'use strict';
module.exports = function (options, server) {
  var loader = require('./loader.js');

  loader(options.folder, '/',  function(file) {
    var route = file.relativePath.match(/^([A-Z\/\-a-z]*)\.route\.js$/);
    if (route) {
      server.logger.info(' -- Loading route ' + route[1]);
      server.app.use(
        route[1],
        require(file.completePath)(server)
      );
    }
  });

};