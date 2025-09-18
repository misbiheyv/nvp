import {WARNING_MSG} from 'utils';
import {globalLogger} from 'core/logger';
import {getLatestsReleases, ReleaseTypes} from 'models/releases';
import type {Command} from './types';

export const lastNews: Command = {
  command: 'last_news',
  description: 'посмотреть последние релизы',
  type: 'base',
  callback: async (ctx) => {
    const res = await getLatestsReleases(ReleaseTypes.ALL);

    if (res == null) {
      return ctx.reply('Упс... Кажется, что-то пошло не так:(\n\nЯ уже знаю об этом и скоро(но это не точно) все налажу');
    }

    const promises: Promise<any>[] = [];

    for (const data of Object.values(res)) {
      promises.push(ctx.replyWithHTML(`${data.text}\n\n${WARNING_MSG}`).catch((err) => globalLogger.error('news:replyWithHTML', err)));
    }

    return Promise.all(promises);
  },
};
