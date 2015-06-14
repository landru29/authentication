'use strict';
var q = require('q');
var crypto = require('crypto');




module.exports = function (server) {
    var encryptPassword = function(password) {
        var hash = crypto.createHmac('sha512', server.config.user.passwordEncrypt);
        hash.update(password)
        return hash.digest('hex')
    };
    
    var getUser= function(username, password) {
        var UserModel = server.model('User');
        var deferred = q.defer();
        if (username && password) {
            UserModel.findOne(
                {
                    username: username, 
                    password: encryptPassword(password)
                },
                {
                    password:false
                },
                function(err, user){
                    if (err) {
                        deferred.reject({error: 'Connection refused'});
                    } else {
                        deferred.resolve(server.services.ObjectCleaner(user));
                    }
                }
            );
        } else {
            deferred.reject({error: 'Connection refused'});
        }
        return deferred.promise;
    };
    
    return {
        getUser: getUser,
        getRefreshToken: function(username, password) {
            var deferred = q.defer();
            getUser(username, password).then(
                function(user) {
                    server.services.OauthToken.encrypt(user, 'refresh-token').then(
                        function(token) {
                            server.logger.info('Grant refresh-token to ' + user.username);
                            deferred.resolve({'refresh-token': token});
                        },
                        function(err) {
                            deferred.reject({error: 'token ecryption'});
                        }
                    );
                }, function(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        },
        addUser: function(username, password, data) {
        }
    };
};