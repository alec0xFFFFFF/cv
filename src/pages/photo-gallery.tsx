import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
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

const ImageItem = ({ photo }: { photo: Photo }) => {
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };
    img.src = photo.filename;
  }, [photo.filename]);

  const getGridArea = () => {
    if (aspectRatio > 1.5) return 'span 1 / span 2'; // Landscape
    if (aspectRatio < 0.75) return 'span 2 / span 1'; // Portrait
    if (aspectRatio >= 0.75 && aspectRatio <= 1.25) return 'span 1 / span 1'; // Medium format or 35mm
    return 'span 1 / span 1'; // Default
  };

  return (
    <div className="image-item" style={{ gridArea: getGridArea() }}>
      <img src={photo.filename} alt={photo.description} />
      <div className="image-description">{photo.description}</div>
    </div>
  );
};

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '200px',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const randomTerm = defaultSearchTerms[Math.floor(Math.random() * defaultSearchTerms.length)];
    setSearchTerm(randomTerm);
    setDebouncedSearchTerm(randomTerm); // Set the debounced term immediately
  }, []);

  const debounce = useCallback((func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
      setPage(1);
      if (value.trim() !== '') {
        setPhotos([]);
      }
    }, 300),
    [debounce]
  );

  const fetchPhotos = useCallback(async () => {
    if (!hasMore || loading || debouncedSearchTerm.trim() === '') return;

    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: '20',
      query: debouncedSearchTerm.trim()
    });

    try {
      const response = await fetch(`/api/search?${params}`);
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
      setError('Failed to fetch photos. Please try again.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [page, debouncedSearchTerm, hasMore, loading]);

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      fetchPhotos();
    } else {
      setInitialLoading(false);
    }
  }, [debouncedSearchTerm, fetchPhotos]);

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedSetSearchTerm(e.target.value);
            }}
            placeholder="Search photos..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {initialLoading ? (
          <div className="flex justify-center items-center h-64">
            <Icon name="loader" className="animate-spin w-8 h-8" />
          </div>
        ) : (
          <>
            {photos.length > 0 ? (
              <div className="image-grid">
                {photos.map((photo, index) => (
                  <ImageItem key={index} photo={photo} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                No results found. Try a different search term.
              </div>
            )}
            {hasMore && (
              <div ref={ref} className="h-20 flex items-center justify-center">
                {loading && <Icon name="loader" className="animate-spin w-8 h-8" />}
              </div>
            )}
          </>
        )}
      </main>
      <style jsx global>{`
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          grid-auto-rows: 200px;
          grid-auto-flow: dense;
          gap: 10px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .image-item {
          position: relative;
          overflow: hidden;
          background-color: #f0f0f0;
        }
        
        .image-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .image-description {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 5px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
