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

const BUNDLED: Record<string, unknown> = {
  'portfolioData.json': _portfolioData,
  'adminCredentials.json': _adminCredentials,
  'authState.json': _authState,
  'loginLogs.json': _loginLogs,
  'sessions.json': _sessions,
};

// ─── Vercel Postgres ─────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _pool: any = null;
let _dbReady = false;

function findConnectionString(): string {
  const candidates = [
    'POSTGRES_URL',
    'POSTGRES_URL_NON_POOLING',
    'DATABASE_URL',
    'STORAGE_URL',
  ];
  for (const name of candidates) {
    if (process.env[name]) return process.env[name]!;
  }
  // Fallback: find any env var containing a postgres connection string
  for (const [key, val] of Object.entries(process.env)) {
    if (val && key.endsWith('_URL') && (val.includes('postgres') || val.includes('supabase'))) {
      return val;
    }
  }
  const available = Object.keys(process.env).filter(k => k.endsWith('_URL')).join(', ');
  throw new Error(`No Postgres connection string found. Available _URL vars: ${available || 'none'}`);
}

async function getPool() {
  if (!_pool) {
    const {createPool} = await import('@vercel/postgres');
    _pool = createPool({connectionString: findConnectionString()});
  }
  return _pool;
}

async function ensureTable() {
  if (_dbReady) return;
  const pool = await getPool();
  await pool.sql`
    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  _dbReady = true;
}

async function seedIfNeeded(key: string) {
  const pool = await getPool();
  const result = await pool.sql`SELECT 1 FROM kv_store WHERE key = ${key} LIMIT 1`;
  if (result.rowCount === 0) {
    const bundled = BUNDLED[key];
    if (bundled !== undefined) {
      await pool.sql`INSERT INTO kv_store (key, value) VALUES (${key}, ${JSON.stringify(bundled)})`;
    }
  }
}

export async function readJSONAsync(filename: string): Promise<unknown> {
  if (!IS_VERCEL) {
    return JSON.parse(fs.readFileSync(path.join(LOCAL_DATA_DIR, filename), 'utf-8'));
  }
  await ensureTable();
  await seedIfNeeded(filename);
  const pool = await getPool();
  const result = await pool.sql`SELECT value FROM kv_store WHERE key = ${filename}`;
  if (result.rows.length === 0) throw new Error(`No data found for key: ${filename}`);
  return result.rows[0].value;
}

export async function writeJSONAsync(filename: string, data: unknown): Promise<void> {
  if (!IS_VERCEL) {
    fs.writeFileSync(path.join(LOCAL_DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
    return;
  }
  await ensureTable();
  const pool = await getPool();
  await pool.sql`
    INSERT INTO kv_store (key, value, updated_at) VALUES (${filename}, ${JSON.stringify(data)}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(data)}, updated_at = NOW()
  `;
}

export function readJSON(filename: string) {
  if (IS_VERCEL) throw new Error('Use readJSONAsync on Vercel');
  return JSON.parse(fs.readFileSync(path.join(LOCAL_DATA_DIR, filename), 'utf-8'));
}

export function writeJSON(filename: string, data: unknown) {
  if (IS_VERCEL) throw new Error('Use writeJSONAsync on Vercel');
  fs.writeFileSync(path.join(LOCAL_DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
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
