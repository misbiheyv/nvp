import 'dotenv/config';
import { MiddlewareFn, Telegraf } from 'telegraf';
import type { BotCommand } from 'telegraf/typings/core/types/typegram';
import BaseBot from './base-bot';

export class TgBot extends BaseBot {

	protected bot: Telegraf;

	protected commands: Map<string, {cb: MiddlewareFn<any>, description?: string}> = new Map();

	constructor(token?: string) {
		super();

		const tok = token ?? process.env.TELEGRAM_TOKEN;

		if (tok == null) {
			throw Error('TELEGRAM_TOKEN was not found');
		}

		this.bot = new Telegraf(tok);
	}

	run(): void {
		try {
			const descriptions: BotCommand[] = [];

			for (const [command, {cb, description}] of this.commands.entries()) {
				if (description) {
					descriptions.push({command, description});
				}

				this.bot.command(command, cb);
			}

			this.bot.telegram.setMyCommands(descriptions);
			this.bot.launch();

			process.once('SIGINT', () => this.bot.stop('SIGINT'));
			process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

		} catch (err) {
			console.error(err);
		}
	}

	command(name: string, cb: MiddlewareFn<any>, description?: string | undefined): typeof this {
		this.commands.set(name, {cb, description});
		return this;
	}

	onStart(cb: MiddlewareFn<any>): typeof this {
		this.bot.start(cb);
		return this;
	}
}
