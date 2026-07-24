import type { Logger as PinoLogger } from 'pino'
import pino, { stdSerializers } from 'pino'
import { env } from '#/config/env.server'

export interface LogContext {
  [key: string]: unknown
}

export interface LogFn {
  (msg: string, ...args: unknown[]): void
  (obj: LogContext | Error, msg?: string, ...args: unknown[]): void
}

export interface ILogger {
  debug: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
  fatal: LogFn

  child: (bindings: LogContext) => ILogger
}

export class Logger implements ILogger {
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

  public debug: LogFn = (...args: unknown[]) => this.logger.debug.bind(null, ...args)
  public info: LogFn = (...args: unknown[]) => this.logger.info.bind(null, ...args)
  public warn: LogFn = (...args: unknown[]) => this.logger.warn.bind(null, ...args)
  public error: LogFn = (...args: unknown[]) => this.logger.error.bind(null, ...args)
  public fatal: LogFn = (...args: unknown[]) => this.logger.fatal.bind(null, ...args)
  public child(bindings: LogContext): ILogger {
    return new Logger(this.logger.child(bindings))
  }
}

export const logger = new Logger()
