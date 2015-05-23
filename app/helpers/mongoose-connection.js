'use strict';

module.exports = function (options) {
  var mongoose = require('mongoose');
  var password = (options.password ? ':' + options.password : '');
  var user = (options.user ? options.user : '');
  var at = (user || password ? '@' : '');
  var host = (options.host ? options.host : '');
  var port = (options.port ? ':' + options.port : '');
  var name = (options.name ? '/' + options.name : '');
  mongoose.connect('mongodb://' + user + password + at + host + port + name);
  return mongoose;
};
