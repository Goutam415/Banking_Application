'use strict';

var defaultEnvConfig = require('./default');
var domainName = 'http://localhost:';
module.exports = {
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/Banking',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
  livereload: false,
  seedDB: {
    seed: true
  },
  baseUrls: {
    center: {
      path: '/center',
      url: domainName + defaultEnvConfig.port + '/center',
      session: 'centerSession'
    },
    manager: {
      path: '/manager',
      url: domainName + defaultEnvConfig.port + '/manager',
      session: 'managerSession'
    },
    patient: {
      path: '/patient',
      url: domainName + defaultEnvConfig.port + '/patient',
      session: 'patientSession'
    }
  }
};
