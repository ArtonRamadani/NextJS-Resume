import crypto from 'crypto';
import type {NextApiRequest, NextApiResponse} from 'next';

import {readJSONAsync, writeJSONAsync} from '../../lib/dataStore';
import {validateToken} from './auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!(await validateToken(token))) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  try {
    const {currentPassword, newPassword} = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({error: 'Both current and new password are required'});
    }
    if (newPassword.length < 6) {
      return res.status(400).json({error: 'New password must be at least 6 characters'});
    }

    const credentials = (await readJSONAsync('adminCredentials.json')) as {username: string; passwordHash: string};
    const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex');

    if (currentHash !== credentials.passwordHash) {
      return res.status(401).json({error: 'Current password is incorrect'});
    }

    credentials.passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
    await writeJSONAsync('adminCredentials.json', credentials);

    return res.status(200).json({success: true});
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Change password API error:', message);
    return res.status(500).json({error: 'Internal server error', detail: message});
  }
}
