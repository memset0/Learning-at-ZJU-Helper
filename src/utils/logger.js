export class Logger {
  log(...args) {
    console.log(this.prefix, ...args);
  }

  warn(...args) {
    console.warn(this.prefix, ...args);
  }

  error(...args) {
    console.error(this.prefix, ...args);
  }

  debug(...args) {
    console.debug(this.prefix, ...args);
  }

  info(...args) {
    console.info(this.prefix, ...args);
  }

  extends(name) {
    return new Logger(this.namespace + ':' + name);
  }

  constructor(namespace) {
    this.namespace = namespace;
    this.prefix = '[' + namespace + ']';
  }
}

export const logger = new Logger('zju-helper');

export default logger;
