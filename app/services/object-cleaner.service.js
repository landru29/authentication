'use strict';

module.exports = function (server) {
    return function(obj) {
        var result = JSON.parse(JSON.stringify(obj));
        result.id = result._id;
        for (var key in result) {
            if ((result.hasOwnProperty(key)) && ((/^_/).test(key))) {
                delete result[key];
            }
        }
        return result;
    };
};