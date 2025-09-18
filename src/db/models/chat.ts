import type {Database as DatabaseInstance, Statement} from 'better-sqlite3';

export type ChatRow = {
  chat_id: number;
  username: string | null;
  first_seen_at: string;
  last_seen_at: string;
  is_active: 0 | 1;
};

export class Chat {
  protected readonly stmtUpsert: Statement;
  protected readonly stmtTouch: Statement;
  protected readonly stmtMarkActive: Statement;
  protected readonly stmtMarkInactive: Statement;
  protected readonly stmtGetById: Statement;
  protected readonly stmtGetAllActive: Statement;

  constructor(protected readonly db: DatabaseInstance) {
    this.stmtUpsert = db.prepare(
      `INSERT INTO chats (chat_id, username)
			 VALUES (@chat_id, @username)
			 ON CONFLICT(chat_id) DO UPDATE SET username=excluded.username`
    );

    this.stmtTouch = db.prepare(
      `UPDATE chats
			 SET last_seen_at = CURRENT_TIMESTAMP
			 WHERE chat_id = ?`
    );

    this.stmtMarkActive = db.prepare(`UPDATE chats SET is_active = 1 WHERE chat_id = ?`);

    this.stmtMarkInactive = db.prepare(`UPDATE chats SET is_active = 0 WHERE chat_id = ?`);

    this.stmtGetById = db.prepare(
      `SELECT chat_id, username, first_seen_at, last_seen_at, is_active
			 FROM chats WHERE chat_id = ?`
    );

    this.stmtGetAllActive = db.prepare(`SELECT chat_id FROM chats WHERE is_active = 1`);
  }

  upsertChat(params: {chatId: number; username?: string | null}): void {
    // eslint-disable-next-line camelcase
    this.stmtUpsert.run({chat_id: params.chatId, username: params.username ?? null});
  }

  touchLastSeen(chatId: number): void {
    this.stmtTouch.run(chatId);
  }

  markActive(chatId: number): void {
    this.stmtMarkActive.run(chatId);
  }

  markInactive(chatId: number): void {
    this.stmtMarkInactive.run(chatId);
  }

  getById(chatId: number): ChatRow | null {
    return (this.stmtGetById.get(chatId) as ChatRow | undefined) ?? null;
  }

  getAllActive(): Array<{chat_id: number}> {
    return this.stmtGetAllActive.all() as Array<{chat_id: number}>;
  }
}
