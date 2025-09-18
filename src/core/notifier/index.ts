import {CronCommand, CronJob} from 'cron';
import {WARNING_MSG} from 'utils';
import {getDb} from 'db';
import {TgBot} from 'tg-bot';
import {getLatestsReleases, ReleaseTypes} from 'models/releases';
import {globalLogger} from 'core/logger';

const getMoscowHour = () =>
  Number(
    new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Europe/Moscow',
      hour: '2-digit',
      hour12: false,
    })
      .formatToParts(new Date())
      .find((p) => p.type === 'hour')?.value ?? '0'
  );

export function runNotifier(bot: TgBot) {
  try {
    const scheduleJob = (pattern: string, cb: CronCommand<unknown>) => new CronJob(pattern, cb, null, true, 'Europe/Moscow');
    const cronJob = async () => {
      try {
        const res = await getLatestsReleases(ReleaseTypes.ALL);
        if (res == null) {
          return;
        }

        const hour = getMoscowHour();
        const {settings} = getDb();
        const recipients = settings.listActiveEnabledByHour(hour);

        for (const recipient of recipients) {
          const chatIdFromDb = recipient.chat_id;
          for (const data of Object.values(res)) {
            await bot.sendHTML(chatIdFromDb, `${data.text}\n\n${WARNING_MSG}`);
          }
        }
      } catch (err) {
        globalLogger.error('news:cronJob', err);
      }
    };

    // Every hour on Friday at minute 0 (Europe/Moscow)
    scheduleJob('0 * * * FRI', cronJob);
  } catch (error) {
    globalLogger.error('Schedulers Registration Error', {error});
  }
}
