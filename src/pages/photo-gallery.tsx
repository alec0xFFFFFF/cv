import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Photo {
  id: string;
  url: string;
  title: string;
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();

  const fetchPhotos = async () => {
    // Replace this with your actual API endpoint
    const response = await fetch(`/api/photos?query=${searchQuery}&page=${page}`);
    const newPhotos = await response.json();
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (inView) {
      fetchPhotos();
    }
  }, [inView]);

  useEffect(() => {
    setPhotos([]);
    setPage(1);
    fetchPhotos();
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Photo Gallery</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search photos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mr-4"
        />
        <Link href="/photo-upload" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload Photos
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="aspect-square">
            <img src={photo.url} alt={photo.title} className="w-full h-full object-cover rounded-lg" />
          </div>
        ))}
      </div>
      <div ref={ref} className="h-10" />
    </div>
  );
}
