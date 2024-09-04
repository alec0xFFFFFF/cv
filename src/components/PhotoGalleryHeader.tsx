import React from 'react';
import { Search } from 'lucide-react';
import { Navigation } from './Navigation';

interface PhotoGalleryHeaderProps {
  onSearch: (value: string) => void;
  currentPage: string;
  searchTerm: string;
}

export const PhotoGalleryHeader: React.FC<PhotoGalleryHeaderProps> = ({
  onSearch,
  currentPage,
  searchTerm,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 py-6 px-4">
      <Navigation currentPage={currentPage} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-light mb-6 text-center text-gray-800 tracking-wide">
          PHOTO GALLERY
        </h1>

        {currentPage === 'photo-gallery' && (
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search photos..."
                className="w-full py-2 px-4 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-700 placeholder-gray-400"
                onChange={(e) => onSearch(e.target.value)}
                value={searchTerm}
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
