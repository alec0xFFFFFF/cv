import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE_URL } from '@/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page, page_size, query } = req.query;

  const params = new URLSearchParams({
    page: page as string,
    page_size: page_size as string,
    query: query as string
  });

  try {
    const response = await fetch(`${API_BASE_URL}/search?${params}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
}
