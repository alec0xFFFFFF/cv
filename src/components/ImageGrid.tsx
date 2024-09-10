import React, { useState, useEffect } from 'react';
import { Photo } from './types';

interface ImageGridProps {
  photos: Photo[];
  onImageClick: (photo: Photo) => void;
}

export function ImageGrid({ photos, onImageClick }: ImageGridProps) {
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) setColumns(1);
      else if (window.innerWidth < 768) setColumns(2);
      else if (window.innerWidth < 1024) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const columnPhotos = Array.from({ length: columns }, () => []);
  photos.forEach((photo, index) => {
    columnPhotos[index % columns].push(photo);
  });

  return (
    <div className="flex gap-4">
      {columnPhotos.map((column, columnIndex) => (
        <div key={columnIndex} className="flex-1 flex flex-col gap-4">
          {column.map((photo, photoIndex) => (
            <div
              key={photoIndex}
              className="relative group"
              onClick={() => onImageClick(photo)}
            >
              <img
                src={photo.filename}
                alt={photo.description || 'Photo'}
                className="w-full h-auto object-cover cursor-pointer"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                <div className="p-4 text-white">
                  {photo.quality_grade !== undefined && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        className={`opacity-90 text-white font-bold rounded-full p-2 ${
                          photo.quality_grade >= 8
                            ? 'bg-green-500'
                            : photo.quality_grade >= 5
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      >
                        {photo.quality_grade}/10
                      </div>
                    </div>
                  )}
                  {photo.location && (
                    <p className="absolute bottom-0 left-0 text-sm p-2">
                      <span></span>
                      {photo.camera} {' // '} {photo.film_stock} {' // '}{' '}
                      {photo.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
