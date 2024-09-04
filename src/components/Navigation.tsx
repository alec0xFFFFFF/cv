import React from 'react';
import Link from 'next/link';
import { Home, Upload, BookImage } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage }) => {
  return (
    <nav className="bg-gray-100 py-2 px-4 border-b border-gray-200">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className={`flex items-center space-x-2 ${currentPage === 'home' ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}>
          <Home size={20} />
          <span className="text-sm font-medium">Home</span>
        </Link>
        <Link href="/photo-upload" className={`flex items-center space-x-2 ${currentPage === 'photo-upload' ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}>
          <Upload size={20} />
          <span className="text-sm font-medium">Upload</span>
        </Link>
        <Link href="/photo-gallery" className={`flex items-center space-x-2 ${currentPage === 'photo-gallery' ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}>
          <BookImage size={20} />
          <span className="text-sm font-medium">Gallery</span>
        </Link>
      </div>
    </nav>
  );
};
