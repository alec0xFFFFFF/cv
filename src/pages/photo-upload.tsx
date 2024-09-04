import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';

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
  const [metadata, setMetadata] = useState<UploadMetadata>({
    directory: '',
    film_format: '',
    film_stock: '',
    date: '',
    processing_lab: '',
    location: '',
    camera: '',
    lens: '',
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {'image/*': []},
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    }
  });

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
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
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">PHOTO GALLERY</h1>
          <nav>
            <Link href="/photo-gallery" className="text-gray-600 hover:text-gray-900">
              Gallery
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors">
            <input {...getInputProps()} />
            <Icon name="upload" className="text-gray-400 mb-4 w-16 h-16 mx-auto" />
            <p className="text-xl text-gray-600">Drag & drop images here, or click to select files</p>
          </div>
          
          {files.length > 0 && (
            <div className="mt-8">
              <p className="text-lg text-gray-600 mb-4">{files.length} file(s) selected</p>
              
              {/* Metadata form */}
              <div className="space-y-4 mb-4">
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                      {key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1)}
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

              <Button onClick={handleUpload} className="w-full" disabled={uploading}>
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
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-right">
          <p className="text-sm text-gray-600">White, Alec</p>
        </div>
      </footer>
    </div>
  );
}
