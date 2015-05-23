'use strict';
module.exports = function(options) {
  return options.mongoose.model('user', {
    name: 'string',
    login: 'string',
    password: 'string',
    email: 'string'
  });
};