import type {NextApiRequest, NextApiResponse} from 'next';

import {readJSONAsync, writeJSONAsync} from '../../lib/dataStore';
import {validateToken} from './auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!(await validateToken(token))) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  try {
    if (req.method === 'GET') {
      const data = await readJSONAsync('portfolioData.json');
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const {section, data} = req.body;
      if (!section) {
        return res.status(400).json({error: 'Section is required'});
      }
      const currentData = (await readJSONAsync('portfolioData.json')) as Record<string, unknown>;
      currentData[section] = data;
      await writeJSONAsync('portfolioData.json', currentData);
      return res.status(200).json({success: true, section});
    }

    return res.status(405).json({error: 'Method not allowed'});
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Portfolio data API error:', message);
    return res.status(500).json({error: 'Internal server error', detail: message});
  }
}
