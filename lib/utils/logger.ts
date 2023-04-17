import { LogMethods, Options } from 'types/logger';

const defaultOptions: Options = {
  passThrough: false
};

export class Logger {
  private readonly options: Options;
  
  /**
   * @param tag - Will be added to every logged message
   * @param {Options} options
   */
  constructor(private tag: string, options: Options = {}) {
    this.options = { ...defaultOptions, ...options };
  }
  
  private logMessage(method: LogMethods, message: string, options?: Options) {
    const logOptions = { ...this.options, ...options };
    console[method]({ tag: this.tag, message, ...logOptions });
  }
  
  debug(message: string, options?: Options) {
    this.logMessage(LogMethods.DEBUG, message, options);
  }
  
  error(message: string, options?: Options) {
    this.logMessage(LogMethods.ERROR, message, options);
  }
  
  warn(message: string, options?: Options) {
    this.logMessage(LogMethods.WARNING, message, options);
  }
  
  info(message: string, options?: Options) {
    this.logMessage(LogMethods.INFO, message, options);
  }
}