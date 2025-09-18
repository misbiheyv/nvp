import type {Database as DatabaseInstance} from 'better-sqlite3';

const SCHEMA_VERSION = 1;

const MIGRATION_V1 = [
  `CREATE TABLE IF NOT EXISTS chats (
		chat_id INTEGER PRIMARY KEY,
		username TEXT NULL,
		first_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		is_active INTEGER NOT NULL DEFAULT 1
	);`,
  `CREATE TABLE IF NOT EXISTS chat_settings (
		chat_id INTEGER PRIMARY KEY REFERENCES chats(chat_id) ON DELETE CASCADE,
		is_notification_enabled INTEGER NOT NULL DEFAULT 1,
		language TEXT NOT NULL DEFAULT 'ALL',
		release_types TEXT NOT NULL DEFAULT 'ALL',
		notify_hour_fri_msk INTEGER NOT NULL DEFAULT 0 CHECK (notify_hour_fri_msk BETWEEN 0 AND 23)
	);`,
  `CREATE INDEX IF NOT EXISTS idx_settings_notify_hour_enabled
		ON chat_settings (notify_hour_fri_msk)
		WHERE is_notification_enabled = 1;`,
];

export const runMigrations = (db: DatabaseInstance): void => {
  const row = db.prepare('PRAGMA user_version').get() as {user_version: number};
  const currentVersion = row?.user_version ?? 0;

  if (currentVersion === SCHEMA_VERSION) {
    return;
  }

  if (currentVersion > SCHEMA_VERSION) {
    throw new Error(`DB schema ${currentVersion} is newer than supported ${SCHEMA_VERSION}`);
  }

  db.transaction(() => {
    if (currentVersion < 1) {
      for (const sql of MIGRATION_V1) {
        db.prepare(sql).run();
      }
    }

    db.prepare(`PRAGMA user_version = ${SCHEMA_VERSION}`).run();
  })();
};
