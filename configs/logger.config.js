const winston = require('winston');
const path = require('path');
const rfs = require('rotating-file-stream');
const env = require('./enviroment');

const options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        format: winston.format.simple(),
        colorize: true,
    },
    file: {
        level: 'info',
        filename: path.join(__dirname,".." ,'logs', 'log.txt'),
        handleExceptions: true,
        format: winston.format.json(),
        maxsize: env.LOG_SIZE || '10M',
        maxFiles: env.LOG_FILES || '7d',
        zippedArchive: env.LOG_ZIP || false,
    },
};

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(options.console),
        new winston.transports.File(options.file),
    ],
    exitOnError: false, // Do not exit on handled exceptions
});

module.exports = logger;
