import type { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';

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

  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.UPLOAD_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const form = new multiparty.Form();

  try {
    const [fields, files] = await new Promise<
      [{ [key: string]: string[] }, { [key: string]: multiparty.File[] }]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Here you would typically process the files and save them to your storage
    // For this example, we'll just log the file information
    console.log('Uploaded files:', files);
    console.log('Form fields:', fields);

    // Simulate file processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.status(200).json({ message: 'Upload successful' });
  } catch (error) {
    console.error('Error parsing form data:', error);
    res.status(500).json({ error: 'Error parsing form data' });
  }
}
