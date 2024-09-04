'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { API_BASE_URL } from '@/config';
import { PhotoGalleryHeader } from '@/components/PhotoGalleryHeader';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import '../app/globals.css';

interface UploadMetadata {
  directory: string;
  film_format: string;
  film_stock: string;
  date: string;
  processing_lab: string;
  location: string;
  camera: string;
  lens: string;
}

export default function PhotoUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [metadata, setMetadata] = useState<UploadMetadata>({
    directory: 'alec',
    film_format: '120',
    film_stock: 'Ilford HP5 40',
    date: new Date().toISOString().split('T')[0], // todo today
    processing_lab: 'Photoworks',
    location: 'SF',
    camera: 'Mamiya C330',
    lens: 'Mamiya Sekor 80mm f2.8',
  });

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  }, []);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  }, []);

  const removeFile = useCallback((fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  }, []);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    // Use 'image' for single upload, 'images' for batch upload
    if (files.length === 1) {
      formData.append('image', files[0]);
    } else {
      files.forEach((file) => {
        formData.append('images', file);
      });
    }

    // Append metadata to formData
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Upload successful!');
        setFiles([]);
        setMetadata({
          directory: '',
          film_format: '',
          film_stock: '',
          date: '',
          processing_lab: '',
          location: '',
          camera: '',
          lens: '',
        });
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PhotoGalleryHeader
        onSearch={() => {}}
        currentPage="photo-upload"
        searchTerm=""
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onFileSelect}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-xl text-gray-600">
                Drag and drop your images here, or click to select files
              </p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Selected Images:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(file)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="mt-1 text-xs text-gray-500 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>

              {/* Metadata form */}
              <div className="space-y-4 mb-4">
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {key.replace('_', ' ').charAt(0).toUpperCase() +
                        key.replace('_', ' ').slice(1)}
                    </label>
                    <input
                      type={key === 'date' ? 'date' : 'text'}
                      name={key}
                      id={key}
                      value={value}
                      onChange={handleMetadataChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={handleUpload}
                className="w-full"
                disabled={uploading}
              >
                {uploading ? (
                  <Icon name="loader" className="animate-spin mr-2" />
                ) : (
                  <Icon name="upload" className="mr-2" />
                )}
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
