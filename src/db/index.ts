import type {Database as DatabaseInstance} from 'better-sqlite3';
import {openConnection} from './connection';
import {runMigrations} from './migrations';
import {Chat} from './models/chat';
import {Settings} from './models/settings';
import {IS_PROD} from 'utils';

export type DbContext = {
  connection: DatabaseInstance;
  chats: Chat;
  settings: Settings;
};

let context: DbContext | null = null;

const initDb = (): DbContext => {
  const connection = openConnection({path: IS_PROD ? process.env.DATA_PATH : process.env.DATA_PATH_DEV});
  runMigrations(connection);

  const chats = new Chat(connection);
  const settings = new Settings(connection);
  context = {connection, chats, settings};

  return context;
};

export const getDb = (): DbContext => {
  if (context == null) {
    initDb();
  }

  return context!;
};
