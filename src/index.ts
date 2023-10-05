import 'dotenv/config';
import { VkParser, ReleaseTypes } from './parsers/vk-parser';
import { normalizeList } from './parsers/vk-parser';
import { commands, stringifiedCommands } from './helpers';
import { TgBot } from './tg-bot/tg-bot';

const bot = new TgBot()
  .onStart((ctx) => ctx.reply(`Добро пожаловать! Список команд:\n\n${stringifiedCommands}`))

  .command('news', async (ctx) => {
    const res = normalizeList(await new VkParser().getClosestReleases());

    if (res == null || res === '') {
      ctx.reply('Oops... Something was wrong');
    }

    ctx.reply(res);
  }, commands.get('news'))

  .command('help', (ctx) => {
    ctx.reply(`Список команд:\n\n${stringifiedCommands}`);
  }, commands.get('help'))

  .command('ping', (ctx) => {
    ctx.reply('pong');
  }, commands.get('ping'));

for (const type of Object.keys(ReleaseTypes)) {
  if (Number(type) >= 0) {
    continue;
  }

  bot.command(type.toLowerCase(), async (ctx) => {
    const res = normalizeList(await new VkParser().getClosestFilteredReleases(ReleaseTypes[type]));

    if (res == null || res === '') {
      ctx.reply('Oops... Something was wrong');
    }

    ctx.reply(res);
  }, commands.get(type.toLowerCase()));
}

bot.run();
