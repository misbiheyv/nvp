import 'dotenv/config';
import TgBot from 'tg-bot';
import { getClosestReleases } from 'helpers';
import { commands, stringifiedCommands } from 'core/helpers';
import { scheduleTasks } from 'core/scheduler';
import { ReleaseTypes } from 'models/releases';

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
      return ctx.reply('Упс... Кажется, что-то пошло не так :(');
    }

    for (const data of Object.values(res)) {
      if (data.attachments?.picture == null) {
        ctx.replyWithHTML(data.text);
        continue;
      }

      ctx.replyWithPhoto({url: data.attachments.picture}, {
        caption: data.text,
        // eslint-disable-next-line camelcase
        parse_mode: 'HTML'
      }).catch(console.error);
    }

  }, commands.get('news'))

  .command('help', (ctx) => ctx.reply(`Список команд:\n\n${stringifiedCommands}`), commands.get('help'))

  .command('ping', (ctx) => ctx.reply('pong'), commands.get('ping'));

for (const type of Object.keys(ReleaseTypes)) {
  if (Number(type) >= 0) {
    continue;
  }

  bot.command(type.toLowerCase(), async (ctx) => {
    const res = await getClosestReleases(ReleaseTypes[type]).then((res) => res[ReleaseTypes[type]]);

    if (res == null) {
      return ctx.reply('Упс... Кажется, что-то пошло не так :(');
    }

    if (res.attachments?.picture == null) {
      ctx.replyWithHTML(res.text);
      return;
    }

    ctx.replyWithPhoto({url: res.attachments.picture}, {
      caption: res.text,

      // eslint-disable-next-line camelcase
      parse_mode: 'HTML'
    }).catch(console.error);

  }, commands.get(type.toLowerCase()));
}

console.log(`App is running in ${process.env.ENVIRONMENT} mode.`);

bot.onError((err) => console.error('error', err));
bot.start();
