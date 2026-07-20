import type { Logger as PinoLogger } from 'pino'
import pino, { stdSerializers } from 'pino'
import { env } from '#/config/env.server'

export interface LogContext {
  [key: string]: unknown
}

export interface LogFn {
  (msg: string, ...args: Array<any>): void
  (obj: LogContext | Error, msg?: string, ...args: Array<any>): void
}

export interface ILogger {
  debug: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
  fatal: LogFn

  child: (bindings: LogContext) => ILogger
}

export class Logger {
  constructor(private logger: PinoLogger = Logger.createRootLogger()) {}

  private static createRootLogger(): PinoLogger {
    const isDev = env.NODE_ENV !== 'production'

    return pino({
      name: 'app-logger',
      level: env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
      serializers: {
        err: stdSerializers.err,
        req: stdSerializers.req,
      },

      redact: {
        paths: [
          'password',
          'confirmPassword',
          'req.headers.authorization',
          '*.creditCard',
          'token',
        ],
        censor: '[REDACTED]',
      },

      transport: {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard' },
      },
    })
  }

  public debug: LogFn = (...args: Array<any>) => (this.logger.debug as any)(...args)
  public info: LogFn = (...args: Array<any>) => (this.logger.info as any)(...args)
  public warn: LogFn = (...args: Array<any>) => (this.logger.warn as any)(...args)
  public error: LogFn = (...args: Array<any>) => (this.logger.error as any)(...args)
  public fatal: LogFn = (...args: Array<any>) => (this.logger.fatal as any)(...args)
  public child(bindings: LogContext): ILogger {
    return new Logger(this.logger.child(bindings))
  }
}

export const logger = new Logger()
