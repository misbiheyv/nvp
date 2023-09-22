import { Telegraf } from 'telegraf';
import 'dotenv/config';

if (process.env.TELEGRAM_TOKEN == null) {
	throw Error('TELEGRAM_TOKEN was not found');
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => ctx.reply('Welcome'));

export { bot };

export default function run() {
	try {
		bot.launch();

	} catch (err) {
		console.error(err);
	}
}
