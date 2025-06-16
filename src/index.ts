import 'dotenv/config';
import {CronCommand, CronJob} from 'cron';

import {TgBot, commands, stringifiedCommands, stringifiedBaseCommands} from 'tg-bot';
import {globalLogger as gl} from 'core/logger';
import {getLatestsReleases, ReleaseTypes} from 'models/releases';

const token = process.env.ENVIRONMENT === 'PROD' ? process.env.TELEGRAM_TOKEN : process.env.TELEGRAM_DEV_TOKEN;

if (token == null) {
  throw new Error('Telegram token is not defined!');
}

const bot = new TgBot(token)
  .onStart((ctx) => {
    ctx.reply(`Добро пожаловать! Список команд:\n\n${stringifiedCommands}`);

    try {
      const scheduleJob = (pattern: string, cb: CronCommand) => new CronJob(pattern, cb, null, true, 'Europe/Moscow');

      scheduleJob('0 19 * * THU', () => ctx.sendMessage(`Дропы через 5 часов:\n${stringifiedBaseCommands}`));
      scheduleJob('0 0 * * FRI', () => ctx.sendMessage(`Чекай дропы:\n${stringifiedBaseCommands}`));
      scheduleJob('0 8 * * FRI', () => ctx.sendMessage(`Чекай дропы:\n${stringifiedBaseCommands}`));
    } catch (error) {
      gl.error('Scheduler Registration Error', {error});
    }
  })

  .command('news', async (ctx) => {
    const res = await getLatestsReleases(ReleaseTypes.ALL);

    if (res == null) {
      return ctx.reply('Упс... Кажется, что-то пошло не так:(\n\nЯ уже знаю об этом и скоро(но это не точно) все налажу');
    }

    const promises: Promise<any>[] = [];

    for (const data of Object.values(res)) {
      // if (data.attachments?.picture) {
      //   promises.push(
      //     ctx.replyWithPhoto({url: data.attachments.picture}, {
      //       caption: data.text,
      //       // eslint-disable-next-line camelcase
      //       parse_mode: 'HTML'
      //     }).catch((err) => {
      //       gl.error('news:replyWithPhoto', err);

      //       return ctx.replyWithHTML(data.text).catch((err) => gl.error('news:replyWithHTML', err));
      //     })
      //   );

      //   continue;
      // }

      promises.push(
        ctx.replyWithHTML(data.text).catch((err) => gl.error('news:replyWithHTML', err))
      );
    }

    return Promise.all(promises);

  }, commands.get('news')?.desc)

  .command('help', (ctx) => ctx.reply(`Список команд:\n\n${stringifiedCommands}`), commands.get('help')?.desc)

  .command('ping', (ctx) => ctx.reply('pong'), commands.get('ping')?.desc);

for (const type of Object.keys(ReleaseTypes)) {
  if (Number(type) >= 0) {
    continue;
  }

  bot.command(type.toLowerCase(), async (ctx) => {
    const
      releaseType = ReleaseTypes[type],
      res = await getLatestsReleases(releaseType).then((res) => res?.[releaseType]);

    if (res == null) {
      return ctx.reply('Упс... Кажется, что-то пошло не так:(\n\nЯ уже знаю об этом и скоро(но это не точно) все налажу');
    }

    if (res.attachments?.picture == null) {
      return ctx.replyWithHTML(res.text).catch((err) => gl.error(`${releaseType}:replyWithHTML`, err));
    }

    return ctx.replyWithPhoto({url: res.attachments.picture}, {
      caption: res.text,

      // eslint-disable-next-line camelcase
      parse_mode: 'HTML'
    }).catch((err) => gl.error(`${releaseType}:replyWithPhoto`, err));

  }, commands.get(type.toLowerCase())?.desc);
}

gl.debug(`App is running in ${process.env.ENVIRONMENT} mode.`);

bot.onError((err, ctx) => {
  gl.error('onError', err);
  ctx.reply('Упс... Кажется, что-то пошло не так:(\n\nЯ уже знаю об этом и скоро(но это не точно) все налажу');
});

bot.start();
