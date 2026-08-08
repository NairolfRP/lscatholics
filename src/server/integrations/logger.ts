import pino, { Logger as PinoLogger, stdSerializers } from 'pino'
import { env } from '#/config/env.server'
import { inDev } from '#server/services/app.service.ts'

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
    return pino({
      name: 'app-logger',
      level: env.LOG_LEVEL || (inDev ? 'debug' : 'info'),
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

      ...(inDev
        ? {
            transport: {
              target: 'pino-pretty',
              options: { colorize: true, translateTime: 'SYS:standard' },
            },
          }
        : {}),
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
