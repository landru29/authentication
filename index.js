(function () {

  var cluster = require('cluster');
  var http = require('http');
  var https = require('https');
  var config = require('./app/config.json');
  var Server = require('./app/app');
  var fs = require('fs');

  var log = function (message, level) {
    console.log((level ? level[0].toUpperCase() + ' ' : '  ') + (new Date()).toISOString() + '[' + process.pid + ']: > ' + message);
  }

  if (cluster.isMaster) {
    var nbProcesses = parseInt(config.process['nb-forks'], 10);

    console.log('######################################');
    console.log('############## API REST ##############');
    console.log('######################################' + "\n");
    console.log('Creating ' + nbProcesses + ' processes');

    // Launch server processes
    var serverProcesses = [];

    for (var i = 0; i < nbProcesses; i++) {
      serverProcesses.push(cluster.fork({
        task: 'server'
      }).process.pid);
    }

    /* relaunch process if dying */
    cluster.on('exit', function (worker) {
      log('Worker ' + worker.process.pid + ' died :(');
      // check if this is a server process
      var index = serverProcesses.indexOf(worker.process.pid);
      if (index > -1) {
        serverProcesses[index] = cluster.fork({
          task: 'server'
        });
      }
      // check if this a th deamon server
      if (deamonProcess === worker.process.pid) {
        deamonProcess = cluster.fork({
          task: 'deamon'
        }).process.pid;
      }
    });

  } else {
    switch (process.env.task) {
      case 'server':
        var application = new Server();

        if (application.config.https) {
          var options = {
            key: fs.readFileSync(__dirname + '/certificate/key.pem'),
            cert: fs.readFileSync(__dirname + '/certificate/key-cert.pem')
          };
          var httpsServer = https.createServer(options,application.app);
          var server = httpsServer.listen(config.process['binding-port'], function () {
            application.logger.info('Express server https listening on port ' + server.address().port);
          });
        } else {
          /* Binding */
          var httpServer = http.createServer(application.app);
          var server = httpServer.listen(config.process['binding-port'], function () {
            application.logger.info('Express server http listening on port ' + server.address().port);
          });
        }
        break;
      case 'deamon':
        var deamon = require('../app/deamon');
        break;
      default:
        break;
    }
  }
})();