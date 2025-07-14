import 'dotenv/config';
import {CronCommand, CronJob} from 'cron';

import {TgBot, lastNews} from 'tg-bot';
import {globalLogger} from 'core/logger';
import {getLatestsReleases, ReleaseTypes} from 'models/releases';

const TELEGRAM_TOKEN = process.env.NODE_ENV === 'production' ? process.env.TELEGRAM_TOKEN : process.env.TELEGRAM_DEV_TOKEN;
// eslint-disable-next-line max-len
const WARNING_MSG = 'PS. Это не бот группы "Новинки в пятницу", я просто беру информацию из их постов. Поддержите ребят и подпишитесь на канал "Новинки в пятницу" в ТГ или группу ВК';

if (TELEGRAM_TOKEN == null) {
  throw new Error('Telegram token is not defined!');
}

const bot = new TgBot(TELEGRAM_TOKEN)
  .onStart((ctx) => {
    ctx.reply(`Добро пожаловать!\n\nПосмотреть самые свежие релизы можно при помощи команды ${lastNews.command}\n\n${WARNING_MSG}`);

    try {
      const scheduleJob = (pattern: string, cb: CronCommand<unknown>) => new CronJob(pattern, cb, null, true, 'Europe/Moscow');

      const cronJob = async () => {
        try {
          const res = await getLatestsReleases(ReleaseTypes.ALL);

          if (res) {
            for (const data of Object.values(res)) {
              ctx.replyWithHTML(`${data.text}\n\n${WARNING_MSG}`).catch((err) => globalLogger.error('news:replyWithHTML', err));
            }
          }
        } catch (err) {
          globalLogger.error('news:cronJob', err);
        }
      };

      scheduleJob('0 0 * * FRI', cronJob);
      scheduleJob('0 8 * * FRI', cronJob);

    } catch (error) {
      globalLogger.error('Schedulers Registration Error', {error});
    }
  })
  .command(lastNews.command, async (ctx) => {
    const res = await getLatestsReleases(ReleaseTypes.ALL);

    if (res == null) {
      return ctx.reply('Упс... Кажется, что-то пошло не так:(\n\nЯ уже знаю об этом и скоро(но это не точно) все налажу');
    }

    const promises: Promise<any>[] = [];

    for (const data of Object.values(res)) {
      promises.push(
        ctx.replyWithHTML(`${data.text}\n\n${WARNING_MSG}`).catch((err) => globalLogger.error('news:replyWithHTML', err))
      );
    }

    return Promise.all(promises);

  }, lastNews.description);

globalLogger.debug(`App is running in ${process.env.NODE_ENV || 'development'} mode.`);

bot.onError((err, ctx) => {
  globalLogger.error('onError', err);
  ctx.reply('Упс... Кажется, что-то пошло не так:(\n\nЯ уже знаю об этом и скоро(но это не точно) все налажу');
});

bot.start();
