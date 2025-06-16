import path from 'path';
import {createLogger, format, transports} from 'winston';
import type {Logger as WinstonLogger} from 'winston';

const
	errorLogsFile = path.resolve('logs/error.log'),
	baseLogsFile = path.resolve('logs/combined.log');

/**
 * Класс предоставляет возможности логирования
 */
export default class Logger {
	/**
	 * Словарь логгеров по неймспейсам
	 */
	protected static instances = new Map<string, Logger>();

	/**
	 * Инстанс логгера
	 */
	protected logger: WinstonLogger;

	protected constructor() {
		this.logger = createLogger({
			level: 'info',
			format: format.combine(
				format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
				format.errors({stack: true}),
				format.splat(),
				format.simple()
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

	/**
	 * Возвращает логгер для переданного неймспейса
	 * @param [namespace]
	 */
	static init(namespace: string = '[[DEFAULT]]') {
		let instance = this.instances.get(namespace);

		if (!instance) {
			instance = new Logger();
			this.instances.set(namespace, instance);
		}

		return instance;
	}

	/** {@link WinstonLogger.info} */
	info(message: string, ...meta: any[]): void;
	info(infoObject: object): void;

	info(messageOrObject: string | object, ...meta: any[]): void {
		if (typeof messageOrObject === 'string') {
			this.logger.info(messageOrObject, ...meta);
			return;
		}

		this.logger.info(meta);
	}

	/** {@link WinstonLogger.debug} */
	debug(message: string, ...meta: any[]): void;
	debug(infoObject: object): void;

	debug(messageOrObject: string | object, ...meta: any[]): void {
		if (typeof messageOrObject === 'string') {
			this.logger.debug(messageOrObject, ...meta);
			return;
		}

		this.logger.debug(meta);
	}

	/** {@link WinstonLogger.warn} */
	warn(message: string, ...meta: any[]): void;
	warn(infoObject: object): void;

	warn(messageOrObject: string | object, ...meta: any[]): void {
		if (typeof messageOrObject === 'string') {
			this.logger.warn(messageOrObject, ...meta);
			return;
		}

		this.logger.warn(meta);
	}

	/** {@link WinstonLogger.error} */
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

/**
 * Глобальный логгер
 */
export const globalLogger = Logger.init();
