import React from 'react';
import { Search } from 'lucide-react';
import { Navigation } from './Navigation';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface PhotoGalleryHeaderProps {
  onSearch: (value: string) => void;
  currentPage: string;
  searchTerm: string;
  sortMode: 'search' | 'rating' | 'date';
  onSortModeChange: (value: string) => void;
  sortDescending: boolean;
  onSortDirectionChange: (checked: boolean) => void;
}

export const PhotoGalleryHeader: React.FC<PhotoGalleryHeaderProps> = ({
  onSearch,
  currentPage,
  searchTerm,
  sortMode,
  onSortModeChange,
  sortDescending,
  onSortDirectionChange,
}) => {
  return (
    <header className="bg-white shadow-sm">
      <Navigation currentPage={currentPage} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Photo Gallery
        </h1>
        {currentPage === 'photo-gallery' && (
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-auto flex-shrink-0">
              <ToggleGroup
                type="single"
                value={sortMode}
                onValueChange={(value: string) =>
                  onSortModeChange(value as string)
                }
              >
                <div className="inline-flex bg-gray-100 rounded-lg p-1">
                  {['search', 'rating', 'date'].map((value) => (
                    <ToggleGroupItem key={value} value={value}>
                      <div
                        className={cn(
                          'px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:text-gray-900 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
                          sortMode === value && 'bg-white text-gray-900'
                        )}
                      >
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </div>
                    </ToggleGroupItem>
                  ))}
                </div>
              </ToggleGroup>
            </div>
            <div className="w-full sm:w-auto flex-grow sm:max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search photos..."
                  className={`w-full py-2 px-4 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300 ${
                    sortMode === 'search'
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                  onChange={(e) => onSearch(e.target.value)}
                  value={searchTerm}
                />
                <Search
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-opacity duration-300 ${
                    sortMode === 'search'
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                  size={20}
                />
              </div>
            </div>
            {sortMode !== 'search' && (
              <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-4 py-2 flex-shrink-0">
                <span className="text-sm font-medium text-gray-700">
                  Ascending
                </span>
                <Switch
                  checked={sortDescending}
                  onCheckedChange={onSortDirectionChange}
                />
                <span className="text-sm font-medium text-gray-700">
                  Descending
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default PhotoGalleryHeader;
