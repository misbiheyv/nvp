import type {Telegraf} from 'telegraf';

export type CommandCb = Parameters<typeof Telegraf.command>[1];

export type Command = {
  command: string;
  callback: CommandCb;
  description: string;
  type: 'base' | 'debug';
};
