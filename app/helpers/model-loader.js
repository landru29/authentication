'use strict';
module.exports = function (options) {
  var fs = require('fs');
  var _ = require('lodash');
  var self = this;
  fs.readdir(__dirname + '/models', function (err, filenames) {
    for (var i in filenames) {
      var filename = filenames[i];
      var pattern = filename.match(/^([A-Za-z]*)\.model\.js$/);
      if (pattern) {
        var modelName = _.capitalize(_.camelCase(pattern[1]))
        options.logger.info(' -- Loading model ' + modelName);
        //var obj = require(__dirname + '/models/' + filename);
        //console.log(__dirname + '/models/' + filename);
        self[modelName] = (require(__dirname + '/models/' + filename))({mongoose: options.db});
      }
    }
  });
};