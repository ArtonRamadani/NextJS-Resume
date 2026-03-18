import fs from 'fs';
import type {NextApiRequest, NextApiResponse} from 'next';
import path from 'path';

import {validateToken} from './auth';

const LOGIN_LOGS_FILE = path.join(process.cwd(), 'src', 'data', 'loginLogs.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!validateToken(token)) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  if (req.method === 'GET') {
    const logs = JSON.parse(fs.readFileSync(LOGIN_LOGS_FILE, 'utf-8'));
    // Return newest first
    return res.status(200).json(logs.reverse());
  }

  // No DELETE allowed - logs should never be deleted
  return res.status(405).json({error: 'Method not allowed. Login logs cannot be deleted.'});
}
