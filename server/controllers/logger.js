import logger from '../winston.js'

export const loggerTest = (req, res) => {
  logger.info('Info')
  logger.debug('Debug')
  logger.error('Error')
  logger.warn('Warn')
  logger.http('Http')
  res.send('Logger test')
}
