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

    for (const list of Object.values(res)) {
      ctx.replyWithPhoto({url: 'https://avatars.mds.yandex.net/get-afishanew/31447/925392f04f6ecd05ffc308fac8367fef/s380x220'}, {
        caption: list,

        // eslint-disable-next-line camelcase
        parse_mode: 'HTML'
      });
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

    ctx.replyWithPhoto({url: 'https://avatars.mds.yandex.net/get-afishanew/31447/925392f04f6ecd05ffc308fac8367fef/s380x220'}, {
      caption: res,

      // eslint-disable-next-line camelcase
      parse_mode: 'HTML'
    });
  }, commands.get(type.toLowerCase()));
}

console.log(`App is running in ${process.env.ENVIRONMENT} mode.`);
bot.start();
