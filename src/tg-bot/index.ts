import {Context, MiddlewareFn, Telegraf} from 'telegraf';
import type {BotCommand, Update} from 'telegraf/typings/core/types/typegram';
import {globalLogger} from 'core/logger';
import {Command} from './commands';

export * from './commands';

/**
 * Класс реализует обертку для взаимодействия с телеграм ботом
 */
export class TgBot {
  /**
   * Инстанс бота
   */
  protected bot: Telegraf;

  /**
   * Список зарегистрированных команд
   */
  protected commands: Set<Command> = new Set();

  constructor(token: string) {
    this.bot = new Telegraf(token);
    this.bot.hears('ping', (ctx) => ctx.reply('pong'));
    this.bot.hears('Ping', (ctx) => ctx.reply('Pong'));
  }

  /**
   * Регистрирует middleware
   */
  use(mw: MiddlewareFn<any>): typeof this {
    this.bot.use(mw);
    return this;
  }

  /**
   * Запускает бота
   */
  start(): void {
    try {
      const descriptions: BotCommand[] = [];

      for (const {command, callback, description} of this.commands) {
        if (description) {
          descriptions.push({command, description});
        }

        this.bot.command(command, async (ctx) => {
          globalLogger.info('commandCall', {
            command,
            id: ctx.chat.id,
          });

          // TODO: Нормально типизировать
          await (<any>callback)(ctx);

          globalLogger.info('commandEnd', {command, id: ctx.chat.id});
        });
      }

      this.bot.telegram.setMyCommands(descriptions);
      this.bot.launch();

      process.once('SIGINT', () => this.bot.stop('SIGINT'));
      process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Отправляет HTML-сообщение в указанный чат
   */
  sendHTML(chatId: number | string, html: string): Promise<void> {
    // eslint-disable-next-line camelcase
    return this.bot.telegram.sendMessage(chatId, html, {parse_mode: 'HTML'}).then(() => undefined);
  }

  /**
   * Регистрирует команду
   */
  command(command: Command): typeof this {
    this.commands.add(command);
    return this;
  }

  /**
   * Регистрирует коллбэк, который отработает на старте приложения
   */
  onStart(cb: MiddlewareFn<any>): typeof this {
    this.bot.start(cb);
    return this;
  }

  /**
   * Регистрирует обработчик ошибок
   */
  onError(handler: (err: unknown, ctx: Context<Update>) => CanPromise<void>): typeof this {
    this.bot.catch(handler);
    return this;
  }
}
