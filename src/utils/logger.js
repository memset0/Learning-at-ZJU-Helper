const PREFIX = '[zju-helper]';

export const logger = {
  log(...args) {
    console.log(PREFIX, ...args);
  },

  error(...args) {
    console.error(PREFIX, ...args);
  },

  debug(...args) {
    console.debug(PREFIX, ...args);
  },

  info(...args) {
    console.info(PREFIX, ...args);
  },
};

export default logger;
