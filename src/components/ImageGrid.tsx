import React from 'react';
import { Photo } from './types';

interface ImageGridProps {
  photos: Photo[];
  onImageClick: (photo: Photo) => void;
}

export function ImageGrid({ photos, onImageClick }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <div key={index} className="relative group">
          <img
            src={photo.filename}
            alt={photo.description || 'Photo'}
            className="w-full h-64 object-cover cursor-pointer"
            onClick={() => onImageClick(photo)}
          />
          {photo.quality_grade !== undefined && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div
                className={`text-black font-bold rounded-full p-2 ${
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
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-y-auto">
            <div className="p-4 text-white">
              {photo.critique && (
                <p className="text-sm mb-2">
                  <strong>Critique:</strong> {photo.critique}
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
