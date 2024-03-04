import 'dotenv/config';
import TgBot from 'tg-bot';
import { getClosestReleases, getPictureURL } from 'helpers';
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

    for (const [type, list] of Object.entries(res)) {
      ctx.replyWithPhoto({url: getPictureURL(<ReleaseTypes>type)}, {
        caption: list,

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

    ctx.replyWithPhoto({url: getPictureURL(ReleaseTypes[type])}, {
      caption: res,

      // eslint-disable-next-line camelcase
      parse_mode: 'HTML'
    }).catch(console.error);
  }, commands.get(type.toLowerCase()));
}

console.log(`App is running in ${process.env.ENVIRONMENT} mode.`);

bot.onError((err) => console.error('error', err));
bot.start();
