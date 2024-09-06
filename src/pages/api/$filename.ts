import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filename } = req.query;

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Filename is required' });
  }

  try {
    const response = await fetch(`/get-image-info/${filename}`);
    if (!response.ok) {
      throw new Error('Failed to fetch image info');
    }

    const data = await response.json();
    res.redirect(data.url);
  } catch (error) {
    console.error('Error fetching image info:', error);
    res.status(404).json({ error: 'Image not found' });
  }
}
