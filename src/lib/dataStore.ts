import fs from 'fs';
import path from 'path';

/**
 * On Vercel, the project filesystem is read-only.
 * We copy JSON files from the bundled source to /tmp on first access,
 * then read/write from /tmp. Locally, we use src/data directly.
 */

const IS_VERCEL = !!process.env.VERCEL;
const TMP_DATA_DIR = '/tmp/portfolio-data';

// Try multiple possible locations for the source data files
function findSrcDataDir(): string {
  const candidates = [
    path.join(process.cwd(), 'src', 'data'),
    path.join(process.cwd(), '.next', 'server', 'src', 'data'),
    path.join(__dirname, '..', '..', 'data'),
    path.join(__dirname, '..', 'data'),
    path.join(__dirname, 'data'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir) && fs.existsSync(path.join(dir, 'portfolioData.json'))) {
      return dir;
    }
  }
  // Fallback
  return path.join(process.cwd(), 'src', 'data');
}

let _srcDataDir: string | null = null;
function getSrcDataDir(): string {
  if (!_srcDataDir) _srcDataDir = findSrcDataDir();
  return _srcDataDir;
}

function ensureTmpDir() {
  if (!fs.existsSync(TMP_DATA_DIR)) {
    fs.mkdirSync(TMP_DATA_DIR, {recursive: true});
  }
}

export function getDataPath(filename: string): string {
  if (!IS_VERCEL) {
    return path.join(getSrcDataDir(), filename);
  }

  ensureTmpDir();
  const tmpPath = path.join(TMP_DATA_DIR, filename);
  const srcPath = path.join(getSrcDataDir(), filename);

  if (!fs.existsSync(tmpPath)) {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, tmpPath);
    } else {
      // Create sensible defaults if source doesn't exist
      const defaults: Record<string, unknown> = {
        'sessions.json': {},
        'authState.json': {failedAttempts: 0, cooldownUntil: null, cooldownCount: 0},
        'loginLogs.json': [],
      };
      if (defaults[filename] !== undefined) {
        fs.writeFileSync(tmpPath, JSON.stringify(defaults[filename], null, 2), 'utf-8');
      } else {
        throw new Error(`Data file not found: ${filename} (searched: ${srcPath})`);
      }
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
