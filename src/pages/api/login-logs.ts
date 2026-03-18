import type {NextApiRequest, NextApiResponse} from 'next';

import {readJSON} from '../../lib/dataStore';
import {validateToken} from './auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!validateToken(token)) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  try {
    if (req.method === 'GET') {
      const logs = readJSON('loginLogs.json');
      return res.status(200).json(logs.reverse());
    }

    return res.status(405).json({error: 'Method not allowed. Login logs cannot be deleted.'});
  } catch (err) {
    console.error('Login logs API error:', err);
    return res.status(500).json({error: 'Internal server error'});
  }
}
