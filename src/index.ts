import 'dotenv/config';
import run, { bot } from './tg-bot';
import { VkParser, ReleaseTypes } from './parsers/vk-parser';
import { normalizeList } from './parsers/vk-parser';

bot.command('news', async (ctx) => {
  const res = normalizeList(await new VkParser().getClosestReleases());

  if (res == null || res === '') {
    ctx.reply('Oops... Something was wrong');
  }

  ctx.reply(res);
});

bot.command('ping', (ctx) => {
  ctx.reply('pong');
});

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
  });
}

run();
