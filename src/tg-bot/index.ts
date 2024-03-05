import { globalLogger } from 'core/logger';
import { Context, MiddlewareFn, Telegraf } from 'telegraf';
import type { BotCommand, Update } from 'telegraf/typings/core/types/typegram';

export default class TgBot {

	protected bot: Telegraf;

	protected commands: Map<string, {cb: Parameters<typeof Telegraf.command>[1], description?: string}> = new Map();

	constructor(token: string) {
		this.bot = new Telegraf(token);
	}

	start(): void {
		try {
			const descriptions: BotCommand[] = [];

			for (const [command, {cb, description}] of this.commands.entries()) {
				if (description) {
					descriptions.push({command, description});
				}

				this.bot.command(command, async (ctx) => {
					globalLogger.info('commandCall', {
						command,
						id: ctx.chat.id
					});

					// TODO: Нормально типизировать
					await (<any>cb)(ctx);

					globalLogger.info('commandEnd', {command, id: ctx.chat.id});
				});
			}

			this.bot.telegram.setMyCommands(descriptions);
			this.bot.launch();

			process.once('SIGINT', () => this.bot.stop('SIGINT'));
			process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

		} catch (err) {
			console.error(err);
		}
	}

	command(name: string, cb: Parameters<typeof Telegraf.command>[1], description?: string | undefined): typeof this {
		this.commands.set(name, {cb, description});
		return this;
	}

	onStart(cb: MiddlewareFn<any>): typeof this {
		this.bot.start(cb);
		return this;
	}

	onError(handler: (err: unknown, ctx: Context<Update>) => CanPromise<void>): typeof this {
		this.bot.catch(handler);
		return this;
	}
}
