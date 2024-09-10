'use client';

import React from 'react';
import { Photo } from './types';

interface ImageItemProps {
  photo: Photo;
}

export const ImageItem: React.FC<ImageItemProps> = ({ photo }) => {
  return (
    <div className="relative overflow-hidden bg-gray-100 group cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
      <img
        src={photo.filename}
        alt={photo.description}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};
