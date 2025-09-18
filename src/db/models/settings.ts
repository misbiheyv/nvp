import type {Database as DatabaseInstance, Statement} from 'better-sqlite3';

export type SettingsRow = {
  chat_id: number;
  is_notification_enabled: 0 | 1;
  language: string;
  release_types: string;
  notify_hour_fri_msk: number;
};

export class Settings {
  protected readonly stmtEnsureDefaults: Statement;
  protected readonly stmtGet: Statement;
  protected readonly stmtUpdate: Statement;
  protected readonly stmtListActiveEnabledByHour: Statement;

  constructor(protected readonly db: DatabaseInstance) {
    this.stmtEnsureDefaults = db.prepare(
      `INSERT OR IGNORE INTO chat_settings (chat_id, is_notification_enabled, language, release_types, notify_hour_fri_msk)
			 VALUES (?, 1, 'ru', 'ALL', 8)`
    );

    this.stmtGet = db.prepare(
      `SELECT chat_id, is_notification_enabled, language, release_types, notify_hour_fri_msk
			 FROM chat_settings WHERE chat_id = ?`
    );

    this.stmtUpdate = db.prepare(
      `UPDATE chat_settings
			 SET 
				is_notification_enabled = COALESCE(@is_notification_enabled, is_notification_enabled),
				language = COALESCE(@language, language),
				release_types = COALESCE(@release_types, release_types),
				notify_hour_fri_msk = COALESCE(@notify_hour_fri_msk, notify_hour_fri_msk)
			 WHERE chat_id = @chat_id`
    );

    this.stmtListActiveEnabledByHour = db.prepare(
      `SELECT s.chat_id
			 FROM chat_settings s
			 JOIN chats c USING (chat_id)
			 WHERE s.is_notification_enabled = 1
			   AND c.is_active = 1
			   AND s.notify_hour_fri_msk = ?`
    );
  }

  ensureDefaults(chatId: number): void {
    this.stmtEnsureDefaults.run(chatId);
  }

  getSettings(chatId: number): SettingsRow | null {
    return (this.stmtGet.get(chatId) as SettingsRow | undefined) ?? null;
  }

  updateSettings(chatId: number, patch: Partial<Omit<SettingsRow, 'chat_id'>>): void {
    /* eslint-disable camelcase */
    this.stmtUpdate.run({
      chat_id: chatId,
      is_notification_enabled: patch.is_notification_enabled,
      language: patch.language,
      release_types: patch.release_types,
      notify_hour_fri_msk: patch.notify_hour_fri_msk,
    });
    /* eslint-enable camelcase */
  }

  listActiveEnabledByHour(hour: number): Array<{chat_id: number}> {
    return this.stmtListActiveEnabledByHour.all(hour) as Array<{chat_id: number}>;
  }
}
