import fs from 'fs';
import path from 'path';

/**
 * On Vercel, the project filesystem is read-only.
 * We copy JSON files from src/data to /tmp on first access,
 * then read/write from /tmp. Locally, we use src/data directly.
 */

const IS_VERCEL = !!process.env.VERCEL;
const SRC_DATA_DIR = path.join(process.cwd(), 'src', 'data');
const TMP_DATA_DIR = '/tmp/portfolio-data';

function ensureTmpDir() {
  if (IS_VERCEL && !fs.existsSync(TMP_DATA_DIR)) {
    fs.mkdirSync(TMP_DATA_DIR, {recursive: true});
  }
}

/**
 * Get the writable path for a data file.
 * On Vercel: copies from src/data to /tmp if not already there, returns /tmp path.
 * Locally: returns the src/data path directly.
 */
export function getDataPath(filename: string): string {
  if (!IS_VERCEL) {
    return path.join(SRC_DATA_DIR, filename);
  }

  ensureTmpDir();
  const tmpPath = path.join(TMP_DATA_DIR, filename);
  const srcPath = path.join(SRC_DATA_DIR, filename);

  // Copy from source to tmp on first access
  if (!fs.existsSync(tmpPath) && fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, tmpPath);
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

/**
 * Get the writable upload directory.
 * On Vercel: /tmp/uploads (note: these won't persist across deploys)
 * Locally: public/uploads
 */
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
