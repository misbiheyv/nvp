import {getDb} from 'db';
import type {Command} from './types';

export const notifyOn: Command = {
  command: 'notify_on',
  description: 'включить уведомления',
  type: 'base',
  callback: async (ctx) => {
    if (ctx.chat?.id) {
      const chatId = Number(ctx.chat.id);
      const {settings} = getDb();

      settings.ensureDefaults(chatId);
      // eslint-disable-next-line camelcase
      settings.updateSettings(chatId, {is_notification_enabled: 1});

      return ctx.reply('Уведомления включены');
    }
  },
};
