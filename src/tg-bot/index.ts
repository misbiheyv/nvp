import { Telegraf } from 'telegraf';
import { onBotStart } from '../scheduler';
import { stringifiedCommands } from '../helpers';
import 'dotenv/config';

if (process.env.TELEGRAM_TOKEN == null) {
	throw Error('TELEGRAM_TOKEN was not found');
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => {
	ctx.reply(`Добро пожаловать! Список команд:\n\n${stringifiedCommands}`);
	onBotStart(ctx);
});

export { bot };

export default function run() {
	try {
		bot.launch();

	} catch (err) {
		console.error(err);
	}
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
