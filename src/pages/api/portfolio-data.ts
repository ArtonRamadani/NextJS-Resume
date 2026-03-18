import type {NextApiRequest, NextApiResponse} from 'next';

import {readJSON, writeJSON} from '../../lib/dataStore';
import {validateToken} from './auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!validateToken(token)) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  try {
    if (req.method === 'GET') {
      return res.status(200).json(readJSON('portfolioData.json'));
    }

    if (req.method === 'PUT') {
      const {section, data} = req.body;
      if (!section) {
        return res.status(400).json({error: 'Section is required'});
      }
      const currentData = readJSON('portfolioData.json');
      currentData[section] = data;
      writeJSON('portfolioData.json', currentData);
      return res.status(200).json({success: true, section});
    }

    return res.status(405).json({error: 'Method not allowed'});
  } catch (err) {
    console.error('Portfolio data API error:', err);
    return res.status(500).json({error: 'Internal server error'});
  }
}
