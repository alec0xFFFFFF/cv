'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  password: string;
}

// Define the interface for the upload response
interface UploadResponse {
  analysis: {
    categories: string[];
    description: string;
    critique?: string; // Add this line
    descriptive_words: string[];
    dominant_colors?: string[];
    mood?: string;
    quality_grade?: number;
    edit_instructions?: string;
  };
  filename: string;
  message: string;
  original_filename: string;
  public_url: string;
}

const cameraOptions = ['Mamiya C330', 'Leica M6', 'Holga 120N'];
const lensOptions = [
  'Mamiya Sekor 80mm f2.8',
  'Leica Summicron 35mm',
  'unknown',
];
const filmStockOptions = [
  'Ilford HP5 400',
  'Kodak Portra 400',
  'Kodak Portra 160',
  'Kodak Portra 800',
  'Lomography',
];
const filmFormatOptions = ['120', '35mm', '35mm in medium format camera'];

export default function PhotoUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [metadata, setMetadata] = useState<UploadMetadata>({
    directory: 'alec',
    film_format: filmFormatOptions[0],
    film_stock: filmStockOptions[0],
    date: new Date().toISOString().split('T')[0],
    processing_lab: 'Photoworks',
    location: 'SF',
    camera: cameraOptions[0],
    lens: lensOptions[0],
    password: '',
  });
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(
    null
  ); // Use the defined interface
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Create a ref for the file input

  useEffect(() => {
    const savedPassword = localStorage.getItem('uploadPassword');
    if (savedPassword) {
      setMetadata((prev) => ({ ...prev, password: savedPassword }));
    }
  }, []);

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

  const handleMetadataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));

    // Save password to localStorage when it changes
    if (name === 'password') {
      localStorage.setItem('uploadPassword', value);
    }
  };

  const handleUpload = async (newFiles?: File[]) => {
    const filesToUpload = newFiles || files; // Use new files if provided

    if (filesToUpload.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    // Use 'image' for single upload, 'images' for batch upload
    if (filesToUpload.length === 1) {
      formData.append('image', filesToUpload[0]);
    } else {
      filesToUpload.forEach((file) => {
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
        headers: {
          'X-API-Key': metadata.password,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        setUploadResponse(data); // Store the response in state
        alert('Upload successful!');
        setFiles([]); // Clear files for another upload
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleUpload(selectedFiles); // Upload the selected files with existing metadata
      e.target.value = ''; // Clear the input value
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
                    {['camera', 'lens', 'film_stock', 'film_format'].includes(
                      key
                    ) ? (
                      <select
                        name={key}
                        id={key}
                        value={value}
                        onChange={handleMetadataChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {(key === 'camera'
                          ? cameraOptions
                          : key === 'lens'
                            ? lensOptions
                            : key === 'film_stock'
                              ? filmStockOptions
                              : filmFormatOptions
                        ).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={key === 'date' ? 'date' : 'text'}
                        name={key}
                        id={key}
                        value={value}
                        onChange={handleMetadataChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    )}
                  </div>
                ))}
                <div key="password">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={metadata.password}
                    onChange={handleMetadataChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <Button
                onClick={() => handleUpload()} // Call handleUpload without arguments
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
          {uploadResponse && ( // Display the upload response if available
            <div className="mt-8 p-4 border border-gray-300 rounded-lg shadow-md relative">
              <h3 className="text-lg font-semibold">Upload Response:</h3>
              <div className="mt-4">
                <img
                  src={uploadResponse.public_url}
                  alt={uploadResponse.original_filename}
                  className="w-full h-auto rounded-lg mb-4"
                />
                {/* Quality Grade Overlay */}
                {uploadResponse.analysis.quality_grade !== undefined && (
                  <div
                    className={`absolute top-2 right-2 text-black font-bold rounded-full p-2 ${
                      uploadResponse.analysis.quality_grade >= 8
                        ? 'bg-green-500'
                        : uploadResponse.analysis.quality_grade >= 5
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                  >
                    {uploadResponse.analysis.quality_grade}/10
                  </div>
                )}
                {uploadResponse.analysis.critique && (
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Critique:</strong>{' '}
                    {uploadResponse.analysis.critique}
                  </p>
                )}
                <p className="text-sm text-gray-700">
                  <strong>Description:</strong>{' '}
                  {uploadResponse.analysis.description}
                </p>
                <div className="mt-2">
                  <strong>Classifications:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {uploadResponse.analysis.categories.map(
                      (category, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {category}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="mt-2">
                  <strong>Descriptive Words:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {uploadResponse.analysis.descriptive_words.map(
                      (word, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {word}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                {uploadResponse.analysis.edit_instructions && (
                  <div className="mt-2">
                    <strong>Edit Instructions:</strong>
                    <p className="text-sm text-gray-700 mt-1">
                      {uploadResponse.analysis.edit_instructions}
                    </p>
                  </div>
                )}
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()} // Open file picker
                className="mt-4"
              >
                Upload Another
              </Button>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                ref={fileInputRef} // Attach ref to the file input
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
