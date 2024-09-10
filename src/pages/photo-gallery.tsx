import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@/components/ui/icon';
import { useInView } from 'react-intersection-observer';
import { PhotoGalleryHeader } from '@/components/PhotoGalleryHeader';
import { FullscreenImage } from '@/components/FullscreenImage';
import { ImageGrid } from '@/components/ImageGrid';
import Editor from '@/components/Editor';
import { Photo } from '@/components/types';
import '../app/globals.css';

interface ApiResponse {
  images: Photo[];
  pagination: {
    has_more: boolean;
    offset: number;
    page_size: number;
    total_results: number;
  };
}

const defaultSearchTerms = [
  'city skyline',
  'nature trails',
  'urban architecture',
  'street photography',
  'outdoor adventure',
  'city parks',
  'weekend getaway',
  'gardens',
  'the bay',
];

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [offset, setOffset] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '200px',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [sortMode, setSortMode] = useState<'search' | 'rating' | 'date'>(
    'date'
  );
  const [sortDescending, setSortDescending] = useState(true);
  const [sortModeChanging, setSortModeChanging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const randomTerm =
      defaultSearchTerms[Math.floor(Math.random() * defaultSearchTerms.length)];
    setSearchTerm(randomTerm);
    setDebouncedSearchTerm(randomTerm);
  }, []);

  const debounce = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (func: (...args: any[]) => void, delay: number) => {
      let timeoutId: NodeJS.Timeout | null = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      setSearchTriggered(true);
    }, 300),
    [debounce]
  );

  const fetchPhotos = useCallback(async () => {
    if (loading || (sortMode === 'search' && debouncedSearchTerm.trim() === ''))
      return;

    setLoading(true);
    setIsLoading(true);

    const params = new URLSearchParams({
      offset: offset.toString(),
      page_size: '20',
      sort_descending: sortDescending.toString(),
    });

    let url = '/api/';
    switch (sortMode) {
      case 'search':
        url += 'search';
        params.append('query', debouncedSearchTerm.trim());
        break;
      case 'rating':
        url += 'photos-by-rating';
        break;
      case 'date':
        url += 'photos-by-date';
        break;
    }

    try {
      const response = await fetch(`${url}?${params}`);
      const data: ApiResponse = await response.json();

      setPhotos((prevPhotos) =>
        offset === 1 ? data.images : [...prevPhotos, ...data.images]
      );
      // Update the offset based on the response
      setOffset(data.pagination.offset + data.pagination.page_size);
      setHasMore(data.pagination.has_more);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setIsLoading(false);
    }
  }, [offset, debouncedSearchTerm, loading, sortMode, sortDescending]);

  useEffect(() => {
    if (
      (sortMode === 'search' &&
        debouncedSearchTerm.trim() !== '' &&
        searchTriggered) ||
      (sortMode !== 'search' && offset === 1)
    ) {
      setOffset(1);
      setPhotos([]);
      setHasMore(true);
      fetchPhotos().then(() => setSortModeChanging(false));
      setSearchTriggered(false);
    } else {
      setInitialLoading(false);
      setSortModeChanging(false);
    }
  }, [debouncedSearchTerm, fetchPhotos, searchTriggered, sortMode]);

  useEffect(() => {
    if (inView && !loading && hasMore && !searchTriggered) {
      fetchPhotos();
    }
  }, [inView, fetchPhotos, loading, hasMore, searchTriggered]);

  const handleImageClick = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
  }, []);

  const handleCloseFullscreen = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleSearchWithTracking = useCallback(
    (value: string) => {
      setSearchTerm(value);
      debouncedSetSearchTerm(value);
    },
    [debouncedSetSearchTerm]
  );

  const handleOpenEditor = useCallback(() => {
    setIsEditorOpen(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setIsEditorOpen(false);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    // Implement the logic to submit the edit
    console.log('Submitting edit');
    // You might want to close the editor here
    setIsEditorOpen(false);
  }, []);

  const handleRegradeEdit = useCallback(() => {
    // Implement the logic to regrade the edit
    console.log('Regrading edit');
  }, []);

  const handleSortModeChange = useCallback((value: string) => {
    setSortMode(value as 'search' | 'rating' | 'date');
    setOffset(1);
    setPhotos([]);
    setHasMore(true);
    setSortModeChanging(true);
  }, []);

  const handleSortDirectionChange = useCallback((checked: boolean) => {
    setSortDescending(checked);
    setOffset(1);
    setPhotos([]);
    setHasMore(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PhotoGalleryHeader
        onSearch={handleSearchWithTracking}
        currentPage="photo-gallery"
        searchTerm={searchTerm}
        sortMode={sortMode}
        onSortModeChange={handleSortModeChange}
        sortDescending={sortDescending}
        onSortDirectionChange={handleSortDirectionChange}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {initialLoading ? (
          <div className="flex justify-center items-center h-64">
            <Icon name="loader" className="animate-spin w-8 h-8" />
          </div>
        ) : (
          <>
            {sortModeChanging ? (
              <div className="flex justify-center items-center h-64">
                <Icon name="loader" className="animate-spin w-8 h-8" />
              </div>
            ) : (
              <>
                {photos.length > 0 && (
                  <div className="min-h-screen bg-gray-100 py-4 px-4">
                    <ImageGrid
                      photos={photos}
                      onImageClick={handleImageClick}
                    />
                  </div>
                )}
                {(isLoading || loading) && (
                  <div className="flex justify-center items-center h-20 mt-4">
                    <Icon name="loader" className="animate-spin w-8 h-8" />
                  </div>
                )}
                {!isLoading && !loading && photos.length === 0 && (
                  <div className="text-center text-gray-500 mt-8">
                    {sortMode === 'search'
                      ? 'No results found. Try a different search term.'
                      : 'No photos found.'}
                  </div>
                )}
                {hasMore && !isLoading && !loading && (
                  <div
                    ref={ref}
                    className="h-20 flex items-center justify-center"
                  />
                )}
                {!hasMore && photos.length > 0 && (
                  <div className="text-center text-gray-500 mt-8 mb-4">
                    No more photos to load.
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
      {selectedPhoto && (
        <FullscreenImage
          photo={selectedPhoto}
          onClose={handleCloseFullscreen}
          onOpenEditor={handleOpenEditor}
        />
      )}
      {isEditorOpen && selectedPhoto && (
        <Editor
          photo={selectedPhoto}
          onClose={handleCloseEditor}
          onSubmitEdit={handleSubmitEdit}
          onRegradeEdit={handleRegradeEdit}
        />
      )}
    </div>
  );
}
