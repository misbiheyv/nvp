import 'dotenv/config';

import {getDb} from 'db';
import {globalLogger} from 'core/logger';
import {runNotifier} from 'core/notifier';
import {TgBot, commands, lastNews} from 'tg-bot';
import {ENV, IS_PROD, WARNING_MSG} from 'utils';

const TELEGRAM_TOKEN = IS_PROD ? process.env.TELEGRAM_TOKEN : process.env.TELEGRAM_TOKEN_DEV;

globalLogger.debug(`App is running in ${ENV} mode.`);

if (TELEGRAM_TOKEN == null) {
  throw new Error('Telegram token is not defined!');
}

const bot = new TgBot(TELEGRAM_TOKEN)
  .use(async (ctx, next) => {
    try {
      if (ctx.chat?.id == null) {
        return next();
      }

      const {chats, settings} = getDb();
      const chatId = Number(ctx.chat.id);
      const username = ctx.from?.username;

      chats.upsertChat({chatId, username});
      chats.markActive(chatId);
      chats.touchLastSeen(chatId);
      settings.ensureDefaults(chatId);
    } catch (err) {
      globalLogger.error('dbMiddleware', err);
    }

    return next();
  })
  .onStart((ctx) => {
    ctx.reply(`Добро пожаловать!\n\nПосмотреть самые свежие релизы можно при помощи команды ${lastNews.command}\n\n${WARNING_MSG}`);
  })
  .onError((err, ctx) => {
    globalLogger.error('onError', err);
    ctx.reply('Упс... Кажется, что-то пошло не так:(\n\nЯ уже знаю об этом и скоро(но это не точно) все налажу');
  });

commands.forEach((command) => {
  if (command.type === 'debug' && IS_PROD) {
    return;
  }

  bot.command(command);
});

bot.start();
runNotifier(bot);
