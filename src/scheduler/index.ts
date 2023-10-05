import { CronJob } from 'cron';
import { stringifiedCommands } from '../helpers';

function scheduleJob(pattern: string, cb) {
	return new CronJob(
		pattern,
		cb,
		null,
		true,
		'Europe/Moscow'
	);
}

export function onBotStart(ctx) {
	scheduleJob('0 19 * * THU', () => ctx.sendMessage(`Дропы через 5 часов:\n${stringifiedCommands}`));
	scheduleJob('0 0 * * FRI', () => ctx.sendMessage(`Чекай дропы:\n${stringifiedCommands}`));
	scheduleJob('0 8 * * FRI', () => ctx.sendMessage(`Чекай дропы:\n${stringifiedCommands}`));
}
