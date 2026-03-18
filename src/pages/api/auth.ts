import crypto from 'crypto';
import fs from 'fs';
import type {NextApiRequest, NextApiResponse} from 'next';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CREDENTIALS_FILE = path.join(DATA_DIR, 'adminCredentials.json');
const AUTH_STATE_FILE = path.join(DATA_DIR, 'authState.json');
const LOGIN_LOGS_FILE = path.join(DATA_DIR, 'loginLogs.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

const BASE_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
const EXTRA_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes per extra attempt
const MAX_ATTEMPTS = 3;
const SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function readJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function appendLoginLog(entry: {timestamp: string; ip: string; success: boolean; username: string}) {
  const logs = readJSON(LOGIN_LOGS_FILE);
  logs.push(entry);
  writeJSON(LOGIN_LOGS_FILE, logs);
}

// File-based sessions so they survive serverless cold starts
function getSessions(): Record<string, number> {
  try { return readJSON(SESSIONS_FILE); } catch { return {}; }
}

function saveSession(token: string, expiry: number) {
  const sessions = getSessions();
  // Clean expired while we're here
  const now = Date.now();
  for (const k of Object.keys(sessions)) {
    if (sessions[k] < now) delete sessions[k];
  }
  sessions[token] = expiry;
  writeJSON(SESSIONS_FILE, sessions);
}

function removeSession(token: string) {
  const sessions = getSessions();
  delete sessions[token];
  writeJSON(SESSIONS_FILE, sessions);
}

export function validateToken(token: string | undefined): boolean {
  if (!token) return false;
  const sessions = getSessions();
  const expiry = sessions[token];
  if (!expiry) return false;
  if (Date.now() > expiry) {
    removeSession(token);
    return false;
  }
  return true;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {username, password} = req.body;
    const authState = readJSON(AUTH_STATE_FILE);
    const credentials = readJSON(CREDENTIALS_FILE);
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    // Check cooldown
    if (authState.cooldownUntil) {
      const cooldownEnd = new Date(authState.cooldownUntil).getTime();
      if (Date.now() < cooldownEnd) {
        const remainingMs = cooldownEnd - Date.now();
        const remainingMin = Math.ceil(remainingMs / 60000);
        return res.status(429).json({
          error: `Too many failed attempts. Try again in ${remainingMin} minute(s).`,
          cooldownUntil: authState.cooldownUntil,
        });
      }
      authState.failedAttempts = 0;
      authState.cooldownUntil = null;
    }

    const passwordHash = hashPassword(password || '');

    if (username === credentials.username && passwordHash === credentials.passwordHash) {
      authState.failedAttempts = 0;
      authState.cooldownUntil = null;
      authState.cooldownCount = 0;
      writeJSON(AUTH_STATE_FILE, authState);

      const token = crypto.randomBytes(32).toString('hex');
      saveSession(token, Date.now() + SESSION_TTL_MS);

      appendLoginLog({timestamp: new Date().toISOString(), ip: clientIp, success: true, username});

      return res.status(200).json({token});
    }

    // Failed attempt
    authState.failedAttempts += 1;
    appendLoginLog({timestamp: new Date().toISOString(), ip: clientIp, success: false, username: username || ''});

    if (authState.failedAttempts >= MAX_ATTEMPTS) {
      authState.cooldownCount += 1;
      const extraMs = Math.max(0, authState.cooldownCount - 1) * EXTRA_COOLDOWN_MS;
      const totalCooldownMs = BASE_COOLDOWN_MS + extraMs;
      authState.cooldownUntil = new Date(Date.now() + totalCooldownMs).toISOString();
      writeJSON(AUTH_STATE_FILE, authState);

      const totalMin = Math.ceil(totalCooldownMs / 60000);
      return res.status(429).json({
        error: `Too many failed attempts. Locked out for ${totalMin} minute(s).`,
        cooldownUntil: authState.cooldownUntil,
      });
    }

    writeJSON(AUTH_STATE_FILE, authState);
    const remaining = MAX_ATTEMPTS - authState.failedAttempts;
    return res.status(401).json({error: `Invalid credentials. ${remaining} attempt(s) remaining.`});
  }

  // GET - validate session
  if (req.method === 'GET') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (validateToken(token)) {
      return res.status(200).json({valid: true});
    }
    return res.status(401).json({valid: false});
  }

  // DELETE - logout
  if (req.method === 'DELETE') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) removeSession(token);
    return res.status(200).json({success: true});
  }

  return res.status(405).json({error: 'Method not allowed'});
}
