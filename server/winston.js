import winston from 'winston'
import { enviroment } from './config/config.js'

const customLevelsOptions = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
  },
  colors: {
    debug: 'blue',
    http: 'green',
    info: 'cyan',
    warning: 'yellow',
    error: 'red',
    fatal: 'magenta'
  }
}

winston.addColors(customLevelsOptions.colors)

const createLogger = (env) => {
  if (env === 'production') {
    return winston.createLogger({
      transports: [
        new winston.transports.File({
          levels: customLevelsOptions.levels,
          level: 'info',
          filename: './logs/errors.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        new winston.transports.Console({
          levels: customLevelsOptions.levels,
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    })
  } else {
    return winston.createLogger({
      transports: [
        new winston.transports.Console({
          levels: customLevelsOptions.levels,
          level: 'fatal',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    })
  }
}
const logger = createLogger(enviroment)

export default logger
