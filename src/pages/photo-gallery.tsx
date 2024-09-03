import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';

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
  const [ref, inView] = useInView();

  useEffect(() => {
    if (searchQuery === '') {
      const randomPhrase = DEFAULT_SEARCH_PHRASES[Math.floor(Math.random() * DEFAULT_SEARCH_PHRASES.length)];
      setSearchQuery(randomPhrase);
      handleSearch(randomPhrase);
    }
  }, []);

  const fetchPhotos = async (query = searchQuery) => {
    if (!hasMore) return;

    const params = new URLSearchParams({
      query: query,
      film_type: filmType,
      page: page.toString(),
      page_size: '10'
    });

    const response = await fetch(`${API_BASE_URL}/search?${params}`);
    const newPhotos = await response.json();
    
    if (newPhotos.length === 0) {
      setHasMore(false);
    } else {
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (inView) {
      fetchPhotos();
    }
  }, [inView]);

  const handleSearch = (event?: React.MouseEvent<HTMLButtonElement>) => {
    setPhotos([]);
    setPage(1);
    setHasMore(true);
    fetchPhotos(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Photo Gallery</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="aspect-square">
            <img src={photo.url} alt={photo.title} className="w-full h-full object-cover rounded-lg" />
          </div>
        ))}
      </div>
      {hasMore && <div ref={ref} className="h-10" />}
    </div>
  );
}
