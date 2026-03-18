import fs from 'fs';
import path from 'path';

// Bundled defaults for seeding
import _adminCredentials from '../data/adminCredentials.json';
import _authState from '../data/authState.json';
import _loginLogs from '../data/loginLogs.json';
import _portfolioData from '../data/portfolioData.json';
import _sessions from '../data/sessions.json';

const IS_VERCEL = !!process.env.VERCEL;
const LOCAL_DATA_DIR = path.join(process.cwd(), 'src', 'data');

// ─── Bundled defaults for DB seeding ─────────────────────
const BUNDLED: Record<string, unknown> = {
  'portfolioData.json': _portfolioData,
  'adminCredentials.json': _adminCredentials,
  'authState.json': _authState,
  'loginLogs.json': _loginLogs,
  'sessions.json': _sessions,
};

// ─── Vercel Postgres (lazy loaded) ───────────────────────
let _sql: typeof import('@vercel/postgres').sql | null = null;
let _dbReady = false;

async function getSQL() {
  if (!_sql) {
    const mod = await import('@vercel/postgres');
    _sql = mod.sql;
  }
  return _sql;
}

async function ensureTable() {
  if (_dbReady) return;
  const sql = await getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  _dbReady = true;
}

async function seedIfNeeded(key: string) {
  const sql = await getSQL();
  const result = await sql`SELECT 1 FROM kv_store WHERE key = ${key} LIMIT 1`;
  if (result.rowCount === 0) {
    const bundled = BUNDLED[key];
    if (bundled !== undefined) {
      await sql`INSERT INTO kv_store (key, value) VALUES (${key}, ${JSON.stringify(bundled)})`;
    }
  }
}

// ─── Public API ──────────────────────────────────────────

export async function readJSONAsync(filename: string): Promise<unknown> {
  if (!IS_VERCEL) {
    const filePath = path.join(LOCAL_DATA_DIR, filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  await ensureTable();
  await seedIfNeeded(filename);
  const sql = await getSQL();
  const result = await sql`SELECT value FROM kv_store WHERE key = ${filename}`;
  if (result.rows.length === 0) {
    throw new Error(`No data found for key: ${filename}`);
  }
  return result.rows[0].value;
}

export async function writeJSONAsync(filename: string, data: unknown): Promise<void> {
  if (!IS_VERCEL) {
    const filePath = path.join(LOCAL_DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return;
  }
  await ensureTable();
  const sql = await getSQL();
  await sql`
    INSERT INTO kv_store (key, value, updated_at) VALUES (${filename}, ${JSON.stringify(data)}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(data)}, updated_at = NOW()
  `;
}

// Sync wrappers for local dev (kept for backward compat)
export function readJSON(filename: string) {
  if (IS_VERCEL) throw new Error('Use readJSONAsync on Vercel');
  const filePath = path.join(LOCAL_DATA_DIR, filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function writeJSON(filename: string, data: unknown) {
  if (IS_VERCEL) throw new Error('Use writeJSONAsync on Vercel');
  const filePath = path.join(LOCAL_DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function getUploadDir(): string {
  if (IS_VERCEL) {
    const dir = '/tmp/uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
    return dir;
  }
  const dir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
  return dir;
}
