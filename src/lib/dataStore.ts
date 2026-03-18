import fs from 'fs';
import path from 'path';
import {Pool} from 'pg';

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

// ─── Postgres (pg) ───────────────────────────────────────
let _pool: Pool | null = null;
let _dbReady = false;

function findConnectionString(): string {
  const candidates = [
    'POSTGRES_URL_NON_POOLING',
    'POSTGRES_URL',
    'DATABASE_URL',
  ];
  for (const name of candidates) {
    if (process.env[name]) return process.env[name]!;
  }
  for (const [key, val] of Object.entries(process.env)) {
    if (val && key.endsWith('_URL') && (val.includes('postgres') || val.includes('supabase'))) {
      return val;
    }
  }
  const available = Object.keys(process.env).filter(k => k.endsWith('_URL')).join(', ');
  throw new Error(`No Postgres connection string found. Available _URL vars: ${available || 'none'}`);
}

function getPool(): Pool {
  if (!_pool) {
    // Strip sslmode param from URL — we pass SSL config directly
    const raw = findConnectionString();
    const connectionString = raw.replace(/[?&]sslmode=[^&]*/g, '').replace(/\?$/, '');
    _pool = new Pool({
      connectionString,
      ssl: {rejectUnauthorized: false},
      max: 5,
      idleTimeoutMillis: 30000,
    });
  }
  return _pool;
}

async function ensureTable() {
  if (_dbReady) return;
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  _dbReady = true;
}

async function seedIfNeeded(key: string) {
  const pool = getPool();
  const result = await pool.query('SELECT 1 FROM kv_store WHERE key = $1 LIMIT 1', [key]);
  if (result.rowCount === 0) {
    const bundled = BUNDLED[key];
    if (bundled !== undefined) {
      await pool.query(
        'INSERT INTO kv_store (key, value) VALUES ($1, $2)',
        [key, JSON.stringify(bundled)],
      );
    }
  }
}

export async function readJSONAsync(filename: string): Promise<unknown> {
  if (!IS_VERCEL && !process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
    return JSON.parse(fs.readFileSync(path.join(LOCAL_DATA_DIR, filename), 'utf-8'));
  }
  await ensureTable();
  await seedIfNeeded(filename);
  const pool = getPool();
  const result = await pool.query('SELECT value FROM kv_store WHERE key = $1', [filename]);
  if (result.rows.length === 0) throw new Error(`No data found for key: ${filename}`);
  return result.rows[0].value;
}

export async function writeJSONAsync(filename: string, data: unknown): Promise<void> {
  if (!IS_VERCEL && !process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
    fs.writeFileSync(path.join(LOCAL_DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
    return;
  }
  await ensureTable();
  const pool = getPool();
  await pool.query(
    `INSERT INTO kv_store (key, value, updated_at) VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
    [filename, JSON.stringify(data)],
  );
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
