import fs from 'fs';
import type {NextApiRequest, NextApiResponse} from 'next';
import path from 'path';

import {getUploadDir} from '../../lib/dataStore';
import {validateToken} from './auth';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!validateToken(token)) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  try {
    const {fileName, fileData} = req.body;
    if (!fileName || !fileData) {
      return res.status(400).json({error: 'fileName and fileData (base64) are required'});
    }

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const finalName = `${timestamp}_${safeName}`;

    const uploadDir = getUploadDir();
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(path.join(uploadDir, finalName), buffer);

    return res.status(200).json({url: `/uploads/${finalName}`});
  } catch (err) {
    console.error('Upload API error:', err);
    return res.status(500).json({error: 'Internal server error'});
  }
}
