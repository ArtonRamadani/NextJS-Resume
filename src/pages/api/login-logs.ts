import type {NextApiRequest, NextApiResponse} from 'next';

import {readJSONAsync} from '../../lib/dataStore';
import {validateToken} from './auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!(await validateToken(token))) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  try {
    if (req.method === 'GET') {
      const logs = (await readJSONAsync('loginLogs.json')) as unknown[];
      return res.status(200).json([...logs].reverse());
    }

    return res.status(405).json({error: 'Method not allowed. Login logs cannot be deleted.'});
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Login logs API error:', message);
    return res.status(500).json({error: 'Internal server error', detail: message});
  }
}
