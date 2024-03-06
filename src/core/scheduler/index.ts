import { CronCommand, CronJob } from 'cron';
import { stringifiedBaseCommands } from 'core/helpers';

/**
 * Планирует задачу
 *
 * @param pattern
 * @param cb
 */
function scheduleJob(pattern: string, cb: CronCommand) {
	return new CronJob(pattern, cb, null, true, 'Europe/Moscow');
}

/**
 * Планирует оповещения о новых дропах
 * @param ctx
 */
export function scheduleTasks(ctx) {
	scheduleJob('0 19 * * THU', () => ctx.sendMessage(`Дропы через 5 часов:\n${stringifiedBaseCommands}`));
	scheduleJob('0 0 * * FRI', () => ctx.sendMessage(`Чекай дропы:\n${stringifiedBaseCommands}`));
	scheduleJob('0 8 * * FRI', () => ctx.sendMessage(`Чекай дропы:\n${stringifiedBaseCommands}`));
}
