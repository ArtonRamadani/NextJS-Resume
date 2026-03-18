import fs from 'fs';
import type {NextApiRequest, NextApiResponse} from 'next';
import path from 'path';

import {validateToken} from './auth';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'portfolioData.json');

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!validateToken(token)) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  if (req.method === 'GET') {
    const data = readData();
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const {section, data} = req.body;
    if (!section) {
      return res.status(400).json({error: 'Section is required'});
    }

    const currentData = readData();
    currentData[section] = data;
    writeData(currentData);
    return res.status(200).json({success: true, section});
  }

  return res.status(405).json({error: 'Method not allowed'});
}
