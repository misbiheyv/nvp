import {createLogger, format, transports} from 'winston';
import type {Logger as WinstonLogger} from 'winston';
import path from 'path';

const
	errorLogsFile = path.resolve('logs/error.log'),
	baseLogsFile = path.resolve('logs/combined.log');

export default class Logger {
	protected static instances = new Map<string, Logger>();

	protected logger: WinstonLogger;

	protected constructor() {
		this.logger = createLogger({
			level: 'info',
			format: format.combine(
				format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
				format.errors({stack: true}),
				format.splat(),
				format.json()
			),

			transports: [
				new transports.File({filename: errorLogsFile, level: 'error'}),
				new transports.File({filename: baseLogsFile})
			]
		});

		if (process.env.ENVIRONMENT === 'DEV') {
			this.logger.add(new transports.Console({
				level: 'debug',
				format: format.combine(
					format.colorize(),
					format.simple()
				)
			}));
		}
	}

	static init(namespace: string = '[[DEFAULT]]') {
		let instance = this.instances.get(namespace);

		if (!instance) {
			instance = new Logger();
			this.instances.set(namespace, instance);
		}

		return instance;
	}

  info(message: string, ...meta: any[]): void;
  info(infoObject: object): void;

	info(messageOrObject: string | object, ...meta: any[]): void {
		if (typeof messageOrObject === 'string') {
			this.logger.info(messageOrObject, ...meta);
			return;
		}

		this.logger.info(meta);
	}

  debug(message: string, ...meta: any[]): void;
  debug(infoObject: object): void;

	debug(messageOrObject: string | object, ...meta: any[]): void {
		if (typeof messageOrObject === 'string') {
			this.logger.debug(messageOrObject, ...meta);
			return;
		}

		this.logger.debug(meta);
	}

  warn(message: string, ...meta: any[]): void;
  warn(infoObject: object): void;

	warn(messageOrObject: string | object, ...meta: any[]): void {
		if (typeof messageOrObject === 'string') {
			this.logger.warn(messageOrObject, ...meta);
			return;
		}

		this.logger.warn(meta);
	}

  error(message: string, ...meta: any[]): void;
  error(infoObject: object): void;

	error(messageOrObject: string | object, ...meta: any[]): void {
		if (typeof messageOrObject === 'string') {
			this.logger.error(messageOrObject, ...meta);
			return;
		}

		this.logger.error(meta);
	}
}

export const globalLogger = Logger.init();
