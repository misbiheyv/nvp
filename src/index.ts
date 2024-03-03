import 'dotenv/config';
import TgBot from 'tg-bot';
import { getClosestReleases } from 'helpers';
import { commands, stringifiedCommands } from 'core/helpers';
import { scheduleTasks } from 'core/scheduler';
import { ReleaseTypes } from 'models/releases';

const bot = new TgBot()
  .onStart((ctx) => {
    scheduleTasks(ctx);
    ctx.reply(`Добро пожаловать! Список команд:\n\n${stringifiedCommands}`);
  })

  .command('news', async (ctx) => {
    const res = await getClosestReleases(ReleaseTypes.ALL);

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
    const res = await getClosestReleases(ReleaseTypes[type]);

    if (res == null || res === '') {
      return ctx.reply('Oops... Something was wrong');
    }

    ctx.reply(res);
  }, commands.get(type.toLowerCase()));
}

bot.start();
