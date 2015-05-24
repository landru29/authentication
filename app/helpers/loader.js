'use strict';

var fs = require('fs');
var path = require('path');

var Loader = function (baseFolder, folder, callback) {
  fs.readdir(path.normalize(baseFolder + '/' + folder), function (err, filenames) {
    for (var i in filenames) {
      var filename = filenames[i];
      var completePath = path.normalize(baseFolder + '/' + folder + '/' + filename);
      if (fs.lstatSync(completePath).isDirectory()) {
        Loader(baseFolder, path.normalize(folder + '/' + filename), callback);
      } else {
        callback({
          baseFolder: baseFolder,
          subFolder: folder,
          filename: filename,
          relativePath: path.normalize(folder + '/' + filename),
          completePath: completePath
        });
      }
    }
  });
};

module.exports =  Loader;