import fs from 'fs';
import path from 'path';

// Import JSON files directly so they're guaranteed to be bundled
// by webpack into the serverless function
import adminCredentials from '../data/adminCredentials.json';
import authState from '../data/authState.json';
import loginLogs from '../data/loginLogs.json';
import portfolioData from '../data/portfolioData.json';
import sessions from '../data/sessions.json';

const IS_VERCEL = !!process.env.VERCEL;
const TMP_DATA_DIR = '/tmp/portfolio-data';
const LOCAL_DATA_DIR = path.join(process.cwd(), 'src', 'data');

// Bundled defaults keyed by filename
const BUNDLED: Record<string, unknown> = {
  'portfolioData.json': portfolioData,
  'adminCredentials.json': adminCredentials,
  'authState.json': authState,
  'loginLogs.json': loginLogs,
  'sessions.json': sessions,
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
    const bundled = BUNDLED[filename];
    if (bundled !== undefined) {
      fs.writeFileSync(tmpPath, JSON.stringify(bundled, null, 2), 'utf-8');
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
