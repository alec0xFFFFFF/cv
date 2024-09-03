import type { NextApiRequest, NextApiResponse } from 'next';

// This is a mock implementation. Replace it with your actual photo fetching logic.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, page } = req.query;
  
  // Simulate fetching photos from a database or external API
  const photos = Array.from({ length: 20 }, (_, i) => ({
    id: `${page}-${i}`,
    url: `https://picsum.photos/400/400?random=${page}-${i}`,
    title: `Photo ${i + 1}`,
  }));

  res.status(200).json(photos);
}
