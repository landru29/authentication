'use strict';
var jwt = require('jsonwebtoken');
var q = require('q');
var encryptors = {};

/**
 * Get encryptor config
 * @param   {String}  encryptorName    Name of the encryptor specfied
 *                                     in authentication.json
 * @returns {Object} Encryptor configuration
 */
var getEncryptor = function(encryptorName) {
    if (!encryptorName) throw 'No encryptor specified';
    var encryptor = encryptors[encryptorName];
    if (!encryptor) throw 'Bad encryptor specified';
    return encryptor;
};

/**
 * Encrypt data
 * @param   {Object}  data             Data to encrypt
 * @param   {String}  encryptorName    Name of the encryptor specfied
 *                                     in authentication.json
 * @returns {String} encrypted data
 */
var encrypt = function (data, encryptorName) {
    var encryptor = getEncryptor(encryptorName);
    return jwt.sign(data, encryptor.secret, {
        algorithm: 'HS256',
        expiresInMinutes: encryptor['expires-in-minutes'] > 0 ? encryptor['expires-in-minutes'] : null
    });
};

/**
 * Async decrypt data
 * @param   {Object} data          Data to decrypt
 * @param   {String} encryptorName Name of the encryptor specfied
 *                                 in authentication.json
 * @returns {Object} decrypted data
 */
var decrypt = function (data, encryptorName) {
    var encryptor = getEncryptor(encryptorName);
    var defered = q.defer();
    jwt.verify(data, encryptor.secret, function (err, decoded) {
        if (err) {
            defered.reject(err);
        } else {
            defered.resolve(decoded);
        }
    });
    return defered.promise;
};



module.exports = function (server) {
    encryptors = server.config.oauth;
    return {
        syncEncryp: function (data, encryptorName) {
            return encrypt(data, encryptorName);
        },
        encrypt: function (data, encryptorName) {
            var defered = q.defer();
            defered.resolve(encrypt(data, encryptorName));
            return defered.promise;
        },
        decrypt: decrypt
    };
};