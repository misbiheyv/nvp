import Database, {Database as DatabaseInstance} from 'better-sqlite3';

export type OpenConnectionOptions = {
  path?: string;
};

export const getDefaultDbPath = (): string => {
  const {DATA_PATH} = process.env;

  if (!DATA_PATH) {
    throw new Error(`DATA_PATH env variable is not defined`);
  }

  return DATA_PATH;
};

export const openConnection = (opts?: OpenConnectionOptions): DatabaseInstance => {
  const db = new Database(opts?.path || getDefaultDbPath(), {fileMustExist: false});

  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('busy_timeout = 3000');
  db.pragma('temp_store = MEMORY');

  return db;
};

export const closeConnection = (db: DatabaseInstance): void => {
  db.close();
};
