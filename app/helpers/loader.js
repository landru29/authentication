'use strict';

var fs = require('fs');
var path = require('path');
var q = require('q');

var Loader = function (baseFolder, folder, callback) {
    var defered = q.defer();
    var promises = [];
    fs.readdir(path.normalize(baseFolder + '/' + folder), function (err, filenames) {
        for (var i in filenames) {
            var filename = filenames[i];
            var completePath = path.normalize(baseFolder + '/' + folder + '/' + filename);
            if (fs.lstatSync(completePath).isDirectory()) {
                promises.push(Loader(baseFolder, path.normalize(folder + '/' + filename), callback));
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
        q.all(promises).then(function() {
            defered.resolve();
        }, function() {
            defered.reject('Error while loading ' + folder + ' in ' + baseFolder);
        });
    });
    return defered.promise;
};

module.exports = function(baseFolder, folder, callback, done) {
    Loader(baseFolder, folder, callback).then(function() {
        done();
    }, function(err) {
        done(err);
    });
};