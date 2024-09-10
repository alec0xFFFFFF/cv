import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE_URL } from '@/config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { offset, page_size, sort_descending } = req.query;

  const params = new URLSearchParams({
    offset: offset as string,
    page_size: page_size as string,
    sort_descending: sort_descending as string,
  });

  try {
    const response = await fetch(`${API_BASE_URL}/photos/by-date?${params}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching photos by date:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
}
