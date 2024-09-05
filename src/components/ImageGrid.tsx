import React from 'react';
import { Photo } from './types';

interface ImageGridProps {
  photos: Photo[];
  onImageClick: (photo: Photo) => void;
}

export function ImageGrid({ photos, onImageClick }: ImageGridProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2">
      {photos.map((photo, index) => (
        <div
          key={index}
          className="relative group break-inside-avoid pb-2"
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
  );
}
