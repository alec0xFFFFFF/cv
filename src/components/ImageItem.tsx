'use client';

import React, { useState, useEffect } from 'react';
import { Photo } from './types';

interface ImageItemProps {
  photo: Photo;
  onImageClick: (photo: Photo) => void;
}

export const ImageItem: React.FC<ImageItemProps> = ({
  photo,
  onImageClick,
}) => {
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };
    img.src = photo.filename;
  }, [photo.filename]);

  const getGridClasses = () => {
    if (aspectRatio > 1.5) return 'col-span-2 row-span-1';
    if (aspectRatio < 0.67) return 'col-span-1 row-span-2';
    return 'col-span-1 row-span-1';
  };

  const getMaxDimensions = () => {
    const baseSize = 300; // Adjust this value as needed
    if (aspectRatio > 1) {
      return `max-w-[${baseSize * aspectRatio}px] max-h-[${baseSize}px]`;
    } else {
      return `max-w-[${baseSize}px] max-h-[${baseSize / aspectRatio}px]`;
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 ${getGridClasses()} ${getMaxDimensions()} group cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105`}
      onClick={() => onImageClick(photo)}
    >
      <img
        src={photo.filename}
        alt={photo.description}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 ease-in-out" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
        <p className="text-sm font-semibold">{photo.description}</p>
        <p className="text-xs mt-1">
          {photo.film_stock} | {photo.film_format}
        </p>
      </div>
    </div>
  );
};
