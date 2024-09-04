import React, { useState, useEffect, useCallback } from 'react';
// Remove the react-intersection-observer import
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import { API_BASE_URL } from '@/config';
// Add import for useInView hook from react-intersection-observer
import { useInView } from 'react-intersection-observer';

interface Photo {
  description: string;
  filename: string;
  film_format: string;
  film_stock: string;
  similarity_score: number;
}

interface ApiResponse {
  images: Photo[];
  pagination: {
    has_next: boolean;
    has_prev: boolean;
    page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
  };
}

const defaultSearchTerms = ['nature', 'city', 'people', 'animals', 'technology', 'food'];

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '200px',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const randomTerm = defaultSearchTerms[Math.floor(Math.random() * defaultSearchTerms.length)];
    setSearchTerm(randomTerm);
  }, []);

  const fetchPhotos = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: '20',
      query: searchTerm
    });

    try {
      const response = await fetch(`${API_BASE_URL}/search?${params}`);
      const data: ApiResponse = await response.json();
      
      if (data.images.length === 0) {
        setHasMore(false);
      } else {
        setPhotos((prevPhotos) => [...prevPhotos, ...data.images]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(data.pagination.has_next);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, searchTerm]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (inView) {
      fetchPhotos();
    }
  }, [inView, fetchPhotos]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">PHOTO GALLERY</h1>
          <nav>
            <Link href="/photo-upload" className="text-gray-600 hover:text-gray-900">
              Upload
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search photos..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="aspect-square">
              <img src={photo.filename} alt={photo.description} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        {hasMore && <div ref={ref} className="h-20 flex items-center justify-center">
          {loading && <Icon name="loader" className="animate-spin" />}
        </div>}
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-right">
          <p className="text-sm text-gray-600">White, Alec</p>
        </div>
      </footer>
    </div>
  );
}
