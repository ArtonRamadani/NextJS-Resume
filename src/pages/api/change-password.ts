import crypto from 'crypto';
import fs from 'fs';
import type {NextApiRequest, NextApiResponse} from 'next';
import path from 'path';

import {validateToken} from './auth';

const CREDENTIALS_FILE = path.join(process.cwd(), 'src', 'data', 'adminCredentials.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!validateToken(token)) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  const {currentPassword, newPassword} = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({error: 'Both current and new password are required'});
  }

  if (newPassword.length < 6) {
    return res.status(400).json({error: 'New password must be at least 6 characters'});
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));
  const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex');

  if (currentHash !== credentials.passwordHash) {
    return res.status(401).json({error: 'Current password is incorrect'});
  }

  credentials.passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2), 'utf-8');

  return res.status(200).json({success: true});
}
