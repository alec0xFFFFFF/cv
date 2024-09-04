import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@/components/ui/icon';
import { useInView } from 'react-intersection-observer';
import { PhotoGalleryHeader } from '@/components/PhotoGalleryHeader';
import { FullscreenImage } from '@/components/FullscreenImage';
import { ImageGrid } from '@/components/ImageGrid';
import { Photo } from '@/components/types';
import '../app/globals.css';

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

const defaultSearchTerms = [
  'nature',
  'city',
  'people',
  'animals',
  'technology',
  'food',
];

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
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const randomTerm =
      defaultSearchTerms[Math.floor(Math.random() * defaultSearchTerms.length)];
    setSearchTerm(randomTerm);
    setDebouncedSearchTerm(randomTerm);
  }, []);

  const debounce = useCallback(
    (func: (...args: any[]) => void, delay: number) => {
      let timeoutId: NodeJS.Timeout | null = null;
      return (...args: any[]) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    },
    []
  );

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
      setPage(1);
      setPhotos([]);
    }, 300),
    [debounce]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      debouncedSetSearchTerm(value);
    },
    [debouncedSetSearchTerm]
  );

  const fetchPhotos = useCallback(async () => {
    if (!hasMore || loading || debouncedSearchTerm.trim() === '') return;

    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: '20',
      query: debouncedSearchTerm.trim(),
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

  const handleImageClick = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
  }, []);

  const handleCloseFullscreen = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PhotoGalleryHeader
        onSearch={handleSearch}
        currentPage="photo-gallery"
        searchTerm={searchTerm}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {initialLoading ? (
          <div className="flex justify-center items-center h-64">
            <Icon name="loader" className="animate-spin w-8 h-8" />
          </div>
        ) : (
          <>
            {photos.length > 0 ? (
              <div className="min-h-screen bg-gray-100 py-8">
                <ImageGrid photos={photos} onImageClick={handleImageClick} />
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                No results found. Try a different search term.
              </div>
            )}
            {hasMore && (
              <div ref={ref} className="h-20 flex items-center justify-center">
                {loading && (
                  <Icon name="loader" className="animate-spin w-8 h-8" />
                )}
              </div>
            )}
          </>
        )}
      </main>
      {selectedPhoto && (
        <FullscreenImage
          photo={selectedPhoto}
          onClose={handleCloseFullscreen}
        />
      )}
    </div>
  );
}
