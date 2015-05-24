/**
 * Module dependencies.
 */
var passport = require('passport-strategy');
var util = require('util');


/**
 * `Strategy` constructor.
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
var Strategy = function (options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) {
    throw new TypeError('OAuth Strategy requires a verify callback');
  }

  this._refreshTokenField = options.refreshTokenField || 'refresh-token';
  this._secretAccessToken = options.secretAccessToken || 'HTRvscgCGRVtvrsrbh';
  this._secretRefreshToken = options.secretRefreshToken || 'jlkexrh,dezopiepdr,fg,nvt';
  this._expiresInMinutes = options.expiresInMinutes || 30;

  passport.Strategy.call(this);
  this.name = 'oauth';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

var decodeToken = function (token, secret) {
  var jwt = require('jsonwebtoken');
  var defered = require('q').defer();
  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      defered.reject(err);
    } else {
      defered.resolve(decoded);
    }
  });
  return defered.promise;
};

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function (req, options) {
  var self = this;

  var done = function (user, token) {
    try {
      if (self._passReqToCallback) {
        this._verify(req, user, token, verified);
      } else {
        this._verify(user, token, verified);
      }
    } catch (ex) {
      return self.error(ex);
    }
  };

  options = options || {};
  var accessToken = req.headers[this._refreshTokenField];

  if (refreshToken) {
    decodeToken(refreshToken, self._secretRefreshToken).then(function (user) {
      var newAccessToken = jwt.sign(
        JSON.parse(JSON.stringify(user)),
        self._secretAccessToken, {
          expiresInMinutes: self._expiresInMinutes
        });
      done(null, newAccessToken);
    }, function (err) {
      self.fail({ message: 'Invalid refresh-token'});
    });
  } else {
    self.fail({ message: 'No token specified'});
  }

  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    self.success(user, info);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
