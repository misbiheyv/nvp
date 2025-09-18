import type {Command} from './types';
import {getDb} from 'db';

export const getDebugInfo: Command = {
  command: 'get_dubug_info',
  description: 'дебаг инфа о чате',
  type: 'debug',
  callback: async (ctx) => {
    if (!ctx.chat.id) {
      return;
    }

    const {settings, chats} = getDb();
    const chatInfo = chats.getById(ctx.chat.id);
    const chatSettings = settings.getSettings(ctx.chat.id);

    return ctx.replyWithMarkdownV2(`\`\`\`json\n${JSON.stringify({chatInfo, chatSettings}, null, 2)}\`\`\``);
  },
};
