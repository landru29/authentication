'use strict';



var route = function(server) {
  var router = require('express').Router();

  router.get('/',
    function(req, res) {
      res.send('hello');
  });

  return router;
};



module.exports = function(server) {
  return route(server);
};