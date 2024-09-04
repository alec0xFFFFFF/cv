import React from 'react';
import { ImageItem } from './ImageItem';
import { Photo } from './types';

interface ImageGridProps {
  photos: Photo[];
  onImageClick: (photo: Photo) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  photos,
  onImageClick,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <ImageItem
            key={photo.filename}
            photo={photo}
            onImageClick={onImageClick}
          />
        ))}
      </div>
    </div>
  );
};
