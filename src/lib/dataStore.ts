import fs from 'fs';
import path from 'path';

/**
 * On Vercel, the project filesystem is read-only and JSON files may not be
 * in the expected location. We bundle defaults via require() so they're
 * always available, then copy to /tmp for read/write access.
 * Locally, we use src/data directly.
 */

const IS_VERCEL = !!process.env.VERCEL;
const TMP_DATA_DIR = '/tmp/portfolio-data';
const LOCAL_DATA_DIR = path.join(process.cwd(), 'src', 'data');

// Bundled defaults — these get compiled into the serverless function
// so they're always available regardless of filesystem layout
function getBundledDefault(filename: string): unknown | null {
  try {
    switch (filename) {
      case 'portfolioData.json': return require('../../data/portfolioData.json');
      case 'adminCredentials.json': return require('../../data/adminCredentials.json');
      case 'authState.json': return require('../../data/authState.json');
      case 'loginLogs.json': return require('../../data/loginLogs.json');
      case 'sessions.json': return require('../../data/sessions.json');
      default: return null;
    }
  } catch {
    return null;
  }
}

// Fallback defaults if even the bundled import fails
const FALLBACK_DEFAULTS: Record<string, unknown> = {
  'sessions.json': {},
  'authState.json': {failedAttempts: 0, cooldownUntil: null, cooldownCount: 0},
  'loginLogs.json': [],
};

function ensureTmpDir() {
  if (!fs.existsSync(TMP_DATA_DIR)) {
    fs.mkdirSync(TMP_DATA_DIR, {recursive: true});
  }
}

export function getDataPath(filename: string): string {
  if (!IS_VERCEL) {
    return path.join(LOCAL_DATA_DIR, filename);
  }

  ensureTmpDir();
  const tmpPath = path.join(TMP_DATA_DIR, filename);

  if (!fs.existsSync(tmpPath)) {
    // Try bundled default first
    const bundled = getBundledDefault(filename);
    if (bundled !== null) {
      fs.writeFileSync(tmpPath, JSON.stringify(bundled, null, 2), 'utf-8');
    } else if (FALLBACK_DEFAULTS[filename] !== undefined) {
      fs.writeFileSync(tmpPath, JSON.stringify(FALLBACK_DEFAULTS[filename], null, 2), 'utf-8');
    } else {
      throw new Error(`No data source found for: ${filename}`);
    }
  }

  return tmpPath;
}

export function readJSON(filename: string) {
  const filePath = getDataPath(filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function writeJSON(filename: string, data: unknown) {
  const filePath = getDataPath(filename);
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
