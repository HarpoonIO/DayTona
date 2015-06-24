var mongoose = require('mongoose');

var productionUrl = require('../config.js').database;
var testUrl = require('../config.js').database;

function connect(onConnected, enviroment) {
  var dbUrl = enviroment ? productionUrl : testUrl;
  mongoose.connect(dbUrl, function(err) {
    if (onConnected) {
      return onConnected(err);
    }
  });
}

function close(onClose) {
  mongoose.connection.close(function() {
    if (onClose) {
      return onClose();
    }
  });
}

(function() {
  mongoose.connection.on('connected', function() { //
    console.log("db open");
  });

  mongoose.connection.on('error', function(error) {
    console.log("db error: " + error);
  });

  mongoose.connection.on('disconnected', function() {
    console.log("db close");
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      console.log("db close termination");
      process.exit(0);
    });
  });

  process.on('SIGTERM', function() {
    mongoose.connection.close(function() {
      console.log("db hard");
      process.exit(0);
    });
  });

})();


module.exports = {
  connect: connect,
  close: close
};
