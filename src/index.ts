import 'dotenv/config';
import { Releases, ReleaseTypes } from './models/releases';
import { normalizeList } from './models/releases';
import { commands, stringifiedCommands } from './core/helpers';
import { scheduleTasks } from './core/scheduler';
import TgBot from './tg-bot';

const bot = new TgBot()
  .onStart((ctx) => {
    scheduleTasks(ctx);
    ctx.reply(`Добро пожаловать! Список команд:\n\n${stringifiedCommands}`);
  })

  .command('news', async (ctx) => {
    const res = normalizeList(await new Releases().getClosest(ReleaseTypes.ALL));

    if (res == null || res === '') {
      return ctx.reply('Oops... Something was wrong');
    }

    ctx.reply(res);
  }, commands.get('news'))

  .command('help', (ctx) => ctx.reply(`Список команд:\n\n${stringifiedCommands}`), commands.get('help'))
  .command('ping', (ctx) => ctx.reply('pong'), commands.get('ping'));

for (const type of Object.keys(ReleaseTypes)) {
  if (Number(type) >= 0) {
    continue;
  }

  bot.command(type.toLowerCase(), async (ctx) => {
    const res = normalizeList(await new Releases().getClosest(ReleaseTypes[type]));

    if (res == null || res === '') {
      return ctx.reply('Oops... Something was wrong');
    }

    ctx.reply(res);
  }, commands.get(type.toLowerCase()));
}

bot.start();
