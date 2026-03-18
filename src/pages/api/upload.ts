import fs from 'fs';
import type {NextApiRequest, NextApiResponse} from 'next';
import path from 'path';

import {validateToken} from './auth';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!validateToken(token)) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  const {fileName, fileData} = req.body;
  if (!fileName || !fileData) {
    return res.status(400).json({error: 'fileName and fileData (base64) are required'});
  }

  // Sanitize filename
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const finalName = `${timestamp}_${safeName}`;

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, {recursive: true});
  }

  // Write file
  const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const filePath = path.join(UPLOAD_DIR, finalName);
  fs.writeFileSync(filePath, buffer);

  // Return the public URL path
  return res.status(200).json({url: `/uploads/${finalName}`});
}
