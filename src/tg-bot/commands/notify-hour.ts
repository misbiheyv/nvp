import {getDb} from 'db';
import type {Command} from './types';

export const notifyHour: Command = {
  command: 'notify_hour',
  description: 'Установить время уведомлений (от 0 до 23 по МСК)',
  type: 'base',
  callback: async (ctx) => {
    if (ctx.chat?.id == null) {
      return;
    }

    const text: string = (ctx.message as any)?.text || '';
    const parts = text.trim().split(/\s+/);
    const arg = parts[1];
    const hour = Number(arg);

    if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
      return ctx.reply('Использование: /notify_hour <0..23> (час по МСК). Например: /notify_hour 8');
    }

    const chatId = Number(ctx.chat.id);
    const {settings} = getDb();

    settings.ensureDefaults(chatId);
    // eslint-disable-next-line camelcase
    settings.updateSettings(chatId, {notify_hour_fri_msk: hour});

    return ctx.reply(`Время успешно установлено! Каждую пятницу в ${hour}:00 по МСК буду рассказывать вам о новых релизах`);
  },
};
