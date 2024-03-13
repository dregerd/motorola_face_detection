import * as winston from 'winston';

const environment = process.env.NODE_ENV || 'development'

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}
  
const level = () => {
    const isDevelopment = environment === 'development'
    return isDevelopment ? 'debug' : 'http'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'white',
    debug: 'magenta',
}

winston.addColors(colors)

const timestampFormat = winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' })

const printFormat = winston.format.printf(
    (info) => `[${info.timestamp}] [${info.service}] ${info.level}: ${info.message}`,
)

const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({all: true}),
            timestampFormat,
            printFormat,
        ),
        handleExceptions: true,
        handleRejections: true,
    })
]


const MainLogger = winston.createLogger({
    level: level(),
    levels,
    transports,
    exitOnError: environment === 'development',
})



export const CreateLogger = function(service) {
    return MainLogger.child({service: service})
}
