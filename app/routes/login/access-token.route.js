'use strict';



var route = function(server) {
  var router = require('express').Router();

  router.get('/',
    function(req, res) {
      var username = req.query.username;
      var password = req.query.password;
      server.services.User.getRefreshToken(username, password).then(function(data){
          res.status(200).json(data);
      }, function(err){
          res.status(500).json(err);
      });
    });

  return router;
};



module.exports = function(server) {
  return route(server);
};