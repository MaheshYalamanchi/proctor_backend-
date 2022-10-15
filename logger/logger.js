'use strict';  
const winston = require('winston');
const fs = require('fs');
const logInfodir = 'logger/InfoLog';
const logErrDir = 'logger/ErrorLog';
/*const { ElasticsearchTransport } = require('winston-elasticsearch');
var ElasticsearchApm = require('@entropy/winston-elasticsearch-apm');

var esTransportOpts = {
  level: 'info',
  index:"user_service",
  clientOpts: { node:process.env.ELASTIC_SEARCH_LOGGING_URL}
}
const esTransport = new ElasticsearchTransport(esTransportOpts);
//apm log
var apm = require('elastic-apm-node').start({
    serviceName: 'UserService',
    // Use if APM Server requires a token
    //secretToken: '',
    environment: process.env.ENVIRONMENT,
    serverUrl: process.env.APMLOGGER,
  });
*/
// Create the log directory if it does not exist
if (!fs.existsSync(logErrDir,logInfodir)) {
    fs.mkdirSync(logErrDir);
    fs.mkdirSync(logInfodir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
const logger =  winston.createLogger ({
    transports: [
        new (require('winston-daily-rotate-file'))({
            filename: `${logErrDir}/errorResults`,
            timestamp: tsFormat,
            datePattern: 'MM-DD-YYYY',
            prepend: true,
            maxsize: '1g',
            maxFiles:'30d',
            "zippedArchive": true,
            level: 'error'
        }),
        new (require('winston-daily-rotate-file'))({
            filename: `${logInfodir}/infoResults`,
            timestamp: tsFormat,
            datePattern: 'MM-DD-YYYY',
            prepend: true,
            maxsize: '1g',
            maxFiles:'30d',
            "zippedArchive": true,
            level: 'info'
        }),
    //    esTransport,
    //    new ElasticsearchApm({ apm: apm })

    ],
    // exceptionHandlers: [
    //     esTransport
    // ],
    exitOnError: false,
    handleExceptions: true  
});


//////////////////////////////////////////////////////////////////////////
module.exports  = logger;

