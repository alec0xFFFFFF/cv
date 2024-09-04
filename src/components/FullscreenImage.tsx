import React from 'react';
import {
  X,
  Camera,
  MapPin,
  Film,
  Star,
  Flame,
  FlaskConical,
  Ruler,
} from 'lucide-react';
import { Photo } from './types';

interface FullscreenImageProps {
  photo: Photo;
  onClose: () => void;
}

export const FullscreenImage: React.FC<FullscreenImageProps> = ({
  photo,
  onClose,
}) => {
  const renderInfoItem = (
    icon: React.ElementType,
    label: string,
    value: string | number | undefined
  ) => {
    // Specify types
    if (!value) return null;

    let valueClass = '';
    if (label === 'Quality Grade') {
      const numericValue = typeof value === 'string' ? parseFloat(value) : value;
      valueClass =
        numericValue >= 8
          ? 'font-bold rounded-full p-2 bg-green-500'
          : numericValue >= 5
            ? 'font-bold rounded-full p-2 bg-yellow-500'
            : 'font-bold rounded-full p-2 bg-red-500';
      value = value + '/10';
    }

    return (
      <div className="flex items-center mr-4 mb-2">
        {React.createElement(icon, {
          size: 16,
          className: 'mr-2 text-gray-400',
        })}
        <span className="text-gray-300 text-sm">{label}: </span>
        <span className={`text-white text-sm ml-1 ${valueClass}`}>{value}</span>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors duration-200"
        aria-label="Close fullscreen view"
      >
        <X size={28} />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full max-w-7xl mx-auto p-4 flex flex-col md:flex-row items-center md:items-start overflow-hidden"
      >
        <div className="w-full md:w-2/3 h-1/2 md:h-full flex items-center justify-center mb-4 md:mb-0">
          <img
            src={photo.filename}
            alt={photo.description || 'Photo'}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
        <div className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto bg-gray-900 bg-opacity-80 p-6 rounded-lg mx-8">
          {photo.description && (
            <p className="text-white text-xl font-semibold mb-4">
              {photo.description}
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 mb-4">
            {renderInfoItem(Camera, 'Camera', photo.camera)}
            {renderInfoItem(Ruler, 'Lens', photo.lens)}
            {renderInfoItem(Film, 'Film Format', photo.film_format)}
            {renderInfoItem(Film, 'Film Stock', photo.film_stock)}
            {renderInfoItem(MapPin, 'Location', photo.location)}
            {renderInfoItem(
              FlaskConical,
              'Processing Lab',
              photo.processing_lab
            )}
            {renderInfoItem(Star, 'Quality Grade', photo.quality_grade)}
            {renderInfoItem(
              Flame,
              'Similarity Score',
              photo.similarity_score?.toFixed(2)
            )}
          </div>
          {photo.critique && (
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">Critique:</h3>
              <p className="text-gray-300 text-sm">{photo.critique}</p>
            </div>
          )}
          {photo.edit_instructions && (
            <div>
              <h3 className="text-white font-semibold mb-2">
                Edit Instructions:
              </h3>
              <p className="text-gray-300 text-sm">{photo.edit_instructions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
