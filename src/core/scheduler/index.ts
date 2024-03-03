import { CronJob } from 'cron';
import { stringifiedBaseCommands } from 'core/helpers';

function scheduleJob(pattern: string, cb) {
	return new CronJob(pattern, cb, null, true, 'Europe/Moscow');
}

export function scheduleTasks(ctx) {
	scheduleJob('0 19 * * THU', () => ctx.sendMessage(`Дропы через 5 часов:\n${stringifiedBaseCommands}`));
	scheduleJob('0 0 * * FRI', () => ctx.sendMessage(`Чекай дропы:\n${stringifiedBaseCommands}`));
	scheduleJob('0 8 * * FRI', () => ctx.sendMessage(`Чекай дропы:\n${stringifiedBaseCommands}`));
}
