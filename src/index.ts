import 'dotenv/config';
import TgBot from 'tg-bot';
import { getClosestReleases } from 'helpers';
import { commands, stringifiedCommands } from 'core/helpers';
import { scheduleTasks } from 'core/scheduler';
import { ReleaseTypes } from 'models/releases';
import { globalLogger } from 'core/logger';

const token = process.env.ENVIRONMENT === 'PROD' ? process.env.TELEGRAM_TOKEN : process.env.TELEGRAM_DEV_TOKEN;

if (token == null) {
  throw new Error('Telegram token is not defined!');
}

const bot = new TgBot(token)
  .onStart((ctx) => {
    scheduleTasks(ctx);
    ctx.reply(`Добро пожаловать! Список команд:\n\n${stringifiedCommands}`);
  })

  .command('news', async (ctx) => {
    const res = await getClosestReleases(ReleaseTypes.ALL);

    if (res == null) {
      return ctx.reply('Упс... Кажется, что-то пошло не так:(\n\nЯ уже знаю об этом и скоро(но это не точно) все налажу');
    }

    const promises: Promise<any>[] = [];

    for (const data of Object.values(res)) {
      if (data.attachments?.picture == null) {
        promises.push(
          ctx.replyWithHTML(data.text).catch((err) => globalLogger.error('news:replyWithHTML', err))
        );
        continue;
      }

      promises.push(
        ctx.replyWithPhoto({url: data.attachments.picture}, {
          caption: data.text,
          // eslint-disable-next-line camelcase
          parse_mode: 'HTML'
        }).catch((err) => globalLogger.error('news:replyWithPhoto', err))
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
      res = await getClosestReleases(releaseType).then((res) => res?.[releaseType]);

    if (res == null) {
      return ctx.reply('Упс... Кажется, что-то пошло не так:(\n\nЯ уже знаю об этом и скоро(но это не точно) все налажу');
    }

    if (res.attachments?.picture == null) {
      return ctx.replyWithHTML(res.text).catch((err) => globalLogger.error(`${releaseType}:replyWithHTML`, err));
    }

    return ctx.replyWithPhoto({url: res.attachments.picture}, {
      caption: res.text,

      // eslint-disable-next-line camelcase
      parse_mode: 'HTML'
    }).catch((err) => globalLogger.error(`${releaseType}:replyWithPhoto`, err));

  }, commands.get(type.toLowerCase())?.desc);
}

globalLogger.debug(`App is running in ${process.env.ENVIRONMENT} mode.`);

bot.onError((err, ctx) => {
  globalLogger.error('onError', err);
  ctx.reply('Упс... Кажется, что-то пошло не так:(\n\nЯ уже знаю об этом и скоро(но это не точно) все налажу');
});

bot.start();
