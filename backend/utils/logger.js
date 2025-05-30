/**
 * Centralized logging utility for DEO Backend
 * Conditionally logs based on environment
 */

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Development-only logging
 */
const devLog = (message, data = '') => {
  if (!isProduction) {
    console.log(message, data);
  }
};

/**
 * Warning logging (shown in all environments)
 */
const warnLog = (message, data = '') => {
  console.warn(message, data);
};

/**
 * Error logging (always shown)
 */
const errorLog = (message, error = '') => {
  console.error(message, error);
};

/**
 * Info logging (production-safe info)
 */
const infoLog = (message, data = '') => {
  if (!isProduction) {
    console.info(message, data);
  }
};

/**
 * Success logging (development only)
 */
const successLog = (message, data = '') => {
  if (!isProduction) {
    console.log(`✅ ${message}`, data);
  }
};

/**
 * Progress logging (development only)
 */
const progressLog = (message, data = '') => {
  if (!isProduction) {
    console.log(`🔄 ${message}`, data);
  }
};

module.exports = {
  devLog,
  warnLog,
  errorLog,
  infoLog,
  successLog,
  progressLog,
  isProduction
}; 