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
          className="relative group mb-2 break-inside-avoid"
          onClick={() => onImageClick(photo)}
        >
          <img
            src={photo.filename}
            alt={photo.description || 'Photo'}
            className="w-full h-auto object-cover cursor-pointer"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-y-auto overflow-x-hidden">
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
              {photo.critique && (
                <p className="text-sm mb-2">
                  <br />
                  <strong>Critique:</strong>
                  <br />
                  {photo.critique}
                </p>
              )}
              {photo.critique && photo.description && (
                <hr className="border-white border-opacity-50 my-2" />
              )}
              {photo.description && (
                <p className="text-sm">
                  <strong>Description:</strong> {photo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
