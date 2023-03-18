import run, { bot } from "./tg-bot";
import { getPostsInTimeRange } from "./vk-parser";

bot.command('news', async (ctx) => {
  ctx.reply(await getPostsInTimeRange());
})

run();