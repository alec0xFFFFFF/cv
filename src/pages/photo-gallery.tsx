import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface Photo {
  id: string;
  url: string;
  title: string;
}

const API_BASE_URL = 'https://photolab-production.up.railway.app';
const DEFAULT_SEARCH_PHRASES = ['beach', 'mountain', 'city', 'nature', 'portrait'];

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filmType, setFilmType] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  const fetchPhotos = useCallback(async (query = searchQuery, reset = false) => {
    if (!hasMore || loading) return;

    setLoading(true);
    const params = new URLSearchParams({
      query: query,
      film_type: filmType,
      page: reset ? '1' : page.toString(),
      page_size: '20'
    });

    try {
      const response = await fetch(`${API_BASE_URL}/search?${params}`);
      const newPhotos = await response.json();
      
      if (newPhotos.length === 0) {
        setHasMore(false);
      } else {
        setPhotos((prevPhotos) => reset ? newPhotos : [...prevPhotos, ...newPhotos]);
        setPage((prevPage) => reset ? 2 : prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filmType, page, hasMore, loading]);

  useEffect(() => {
    if (searchQuery === '') {
      const randomPhrase = DEFAULT_SEARCH_PHRASES[Math.floor(Math.random() * DEFAULT_SEARCH_PHRASES.length)];
      setSearchQuery(randomPhrase);
      fetchPhotos(randomPhrase, true);
    }
  }, []);

  useEffect(() => {
    if (inView) {
      fetchPhotos();
    }
  }, [inView, fetchPhotos]);

  const handleSearch = () => {
    setPhotos([]);
    setPage(1);
    setHasMore(true);
    fetchPhotos(searchQuery, true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Photo Gallery</h1>
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-1/3">
              <Input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
              <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Film Type"
              value={filmType}
              onChange={(e) => setFilmType(e.target.value)}
              className="w-full sm:w-1/3"
            />
            <Button onClick={handleSearch} className="w-full sm:w-auto">
              <Icon name="search" className="mr-2" />
              Search
            </Button>
            <Link href="/photo-upload" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                <Icon name="upload" className="mr-2" />
                Upload Photos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden transition-transform duration-300 hover:scale-105">
            <CardContent className="p-0">
              <img src={photo.url} alt={photo.title} className="w-full h-64 object-cover" />
            </CardContent>
          </Card>
        ))}
      </div>
      {hasMore && <div ref={ref} className="h-20 flex items-center justify-center">
        {loading && <Icon name="loader" className="animate-spin" />}
      </div>}
    </div>
  );
}
