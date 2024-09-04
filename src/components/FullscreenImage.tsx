import React from 'react';
import { X } from 'lucide-react';
import { Photo } from './types';

interface FullscreenImageProps {
  photo: Photo;
  onClose: () => void;
}

export const FullscreenImage: React.FC<FullscreenImageProps> = ({
  photo,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        aria-label="Close fullscreen view"
      >
        <X size={24} />
      </button>
      <img
        src={photo.filename}
        alt={photo.description}
        className="max-w-full max-h-full object-contain"
      />
      <p className="absolute bottom-4 left-4 text-white text-sm">
        {photo.description}
      </p>
    </div>
  );
};
