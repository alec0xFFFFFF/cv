import type { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';
import https from 'https';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new multiparty.Form({
    // Set a custom boundary
    maxFieldsSize: 200 * 1024 * 1024, // Optional: adjust as needed
  });

  // Manually define the boundary
  const boundary = `----WebKitFormBoundary${Math.random().toString(36).slice(2)}`;

  // Update the headers
  const [fields, files] = await new Promise<
    [{ [key: string]: string[] }, { [key: string]: multiparty.File[] }]
  >((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve([fields, files]);
    });
  });

  const apiKey = fields.password?.[0];
  if (!apiKey) {
    return res.status(401).json({ error: 'Password (API Key) is required' });
  }

  const isBatchUpload = files.images && files.images.length > 1;
  const endpoint = isBatchUpload ? '/batch-upload' : '/upload';

  // Prepare the request options
  const options = {
    hostname: 'photolab-production.up.railway.app',
    path: endpoint,
    method: 'POST',
    headers: {
      Origin: 'https://0xffffff.codes',
      Referer: 'https://0xffffff.codes/',
      Accept: '*/*',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15',
      'X-API-Key': apiKey,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
  };

  // Make the request to the external API
  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
    proxyRes.pipe(res);
  });

  // Handle errors
  proxyReq.on('error', (error) => {
    console.error('Error proxying request:', error);
    res.status(500).json({ error: 'Error proxying request' });
  });

  // Write the original request body to the proxied request
  req.pipe(proxyReq);

  try {
    const [fields, files] = await new Promise<
      [{ [key: string]: string[] }, { [key: string]: multiparty.File[] }]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const apiKey = fields.password?.[0];
    if (!apiKey) {
      return res.status(401).json({ error: 'Password (API Key) is required' });
    }

    const isBatchUpload = files.images && files.images.length > 1;
    const endpoint = isBatchUpload ? '/batch-upload' : '/upload';

    // Prepare the request options
    const options = {
      hostname: 'photolab-production.up.railway.app',
      path: endpoint,
      method: 'POST',
      headers: {
        Origin: 'https://0xffffff.codes',
        Referer: 'https://0xffffff.codes/',
        Accept: '*/*',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15',
        'X-API-Key': apiKey,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
    };

    // Make the request to the external API
    const proxyReq = https.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res);
    });

    // Handle errors
    proxyReq.on('error', (error) => {
      console.error('Error proxying request:', error);
      res.status(500).json({ error: 'Error proxying request' });
    });

    // Write the original request body to the proxied request
    req.pipe(proxyReq);
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: 'Error processing upload' });
  }
}
