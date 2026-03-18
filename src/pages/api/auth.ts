import crypto from 'crypto';
import type {NextApiRequest, NextApiResponse} from 'next';

import {readJSONAsync, writeJSONAsync} from '../../lib/dataStore';

const BASE_COOLDOWN_MS = 60 * 60 * 1000;
const EXTRA_COOLDOWN_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const SESSION_TTL_MS = 4 * 60 * 60 * 1000;

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function getSessions(): Promise<Record<string, number>> {
  try { return (await readJSONAsync('sessions.json')) as Record<string, number>; } catch { return {}; }
}

async function saveSessions(sessions: Record<string, number>) {
  await writeJSONAsync('sessions.json', sessions);
}

async function saveSession(token: string, expiry: number) {
  const sessions = await getSessions();
  const now = Date.now();
  for (const k of Object.keys(sessions)) {
    if (sessions[k] < now) delete sessions[k];
  }
  sessions[token] = expiry;
  await saveSessions(sessions);
}

async function removeSession(token: string) {
  const sessions = await getSessions();
  delete sessions[token];
  await saveSessions(sessions);
}

export async function validateToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const sessions = await getSessions();
  const expiry = sessions[token];
  if (!expiry) return false;
  if (Date.now() > expiry) {
    await removeSession(token);
    return false;
  }
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const {username, password} = req.body;
      const authState = (await readJSONAsync('authState.json')) as {failedAttempts: number; cooldownUntil: string | null; cooldownCount: number};
      const credentials = (await readJSONAsync('adminCredentials.json')) as {username: string; passwordHash: string};
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

      if (authState.cooldownUntil) {
        const cooldownEnd = new Date(authState.cooldownUntil).getTime();
        if (Date.now() < cooldownEnd) {
          const remainingMin = Math.ceil((cooldownEnd - Date.now()) / 60000);
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
        await writeJSONAsync('authState.json', authState);

        const token = crypto.randomBytes(32).toString('hex');
        await saveSession(token, Date.now() + SESSION_TTL_MS);

        // Log success
        const logs = (await readJSONAsync('loginLogs.json')) as unknown[];
        logs.push({timestamp: new Date().toISOString(), ip: clientIp, success: true, username});
        await writeJSONAsync('loginLogs.json', logs);

        return res.status(200).json({token});
      }

      // Failed attempt
      authState.failedAttempts += 1;
      const logs = (await readJSONAsync('loginLogs.json')) as unknown[];
      logs.push({timestamp: new Date().toISOString(), ip: clientIp, success: false, username: username || ''});
      await writeJSONAsync('loginLogs.json', logs);

      if (authState.failedAttempts >= MAX_ATTEMPTS) {
        authState.cooldownCount += 1;
        const extraMs = Math.max(0, authState.cooldownCount - 1) * EXTRA_COOLDOWN_MS;
        const totalCooldownMs = BASE_COOLDOWN_MS + extraMs;
        authState.cooldownUntil = new Date(Date.now() + totalCooldownMs).toISOString();
        await writeJSONAsync('authState.json', authState);

        const totalMin = Math.ceil(totalCooldownMs / 60000);
        return res.status(429).json({
          error: `Too many failed attempts. Locked out for ${totalMin} minute(s).`,
          cooldownUntil: authState.cooldownUntil,
        });
      }

      await writeJSONAsync('authState.json', authState);
      const remaining = MAX_ATTEMPTS - authState.failedAttempts;
      return res.status(401).json({error: `Invalid credentials. ${remaining} attempt(s) remaining.`});
    }

    if (req.method === 'GET') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (await validateToken(token)) {
        return res.status(200).json({valid: true});
      }
      return res.status(401).json({valid: false});
    }

    if (req.method === 'DELETE') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) await removeSession(token);
      return res.status(200).json({success: true});
    }

    return res.status(405).json({error: 'Method not allowed'});
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Auth API error:', message, err);
    return res.status(500).json({error: 'Internal server error', detail: message});
  }
}
