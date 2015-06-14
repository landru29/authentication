'use strict';
module.exports = function(options) {
    return new options.mongoose.Schema({
        name: String,
        username: String,
        password: String,
        email: String
    });
};