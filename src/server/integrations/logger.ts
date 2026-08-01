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

  public debug: LogFn = (...args: unknown[]) =>
    this.logger.debug(...(args as Parameters<PinoLogger['debug']>))
  public info: LogFn = (...args: unknown[]) =>
    this.logger.info(...(args as Parameters<PinoLogger['info']>))
  public warn: LogFn = (...args: unknown[]) =>
    this.logger.warn(...(args as Parameters<PinoLogger['warn']>))
  public error: LogFn = (...args: unknown[]) =>
    this.logger.error(...(args as Parameters<PinoLogger['error']>))
  public fatal: LogFn = (...args: unknown[]) =>
    this.logger.fatal(...(args as Parameters<PinoLogger['fatal']>))
  public child(bindings: LogContext): ILogger {
    return new Logger(this.logger.child(bindings))
  }
}

export const logger = new Logger()
