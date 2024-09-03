import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const API_BASE_URL = 'https://photolab-production.up.railway.app';

export default function PhotoUpload() {
  const [apiKey, setApiKey] = useState('');
  const [directory, setDirectory] = useState('alec');
  const [filmType, setFilmType] = useState('');
  const [date, setDate] = useState('');
  const [processingLab, setProcessingLab] = useState('');
  const [location, setLocation] = useState('');
  const [camera, setCamera] = useState('');
  const [lens, setLens] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {'image/*': []},
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    }
  });

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('directory', directory);
    formData.append('film_type', filmType);
    formData.append('date', date);
    formData.append('processing_lab', processingLab);
    formData.append('location', location);
    formData.append('camera', camera);
    formData.append('lens', lens);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Upload successful!');
        setFiles([]);
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('An error occurred during upload.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Photo Upload</h1>
      <Input
        type="password"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="mb-4"
      />
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-8 mb-4 cursor-pointer">
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Icon name="upload" className="text-gray-400 mb-2" />
          <p>Drag + drop some images here, or click to select files</p>
        </div>
      </div>
      {files.length > 0 && (
        <p className="mb-4">{files.length} file(s) selected</p>
      )}
      <Input
        placeholder="Directory"
        value={directory}
        onChange={(e) => setDirectory(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Film Type"
        value={filmType}
        onChange={(e) => setFilmType(e.target.value)}
        className="mb-4"
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Processing Lab"
        value={processingLab}
        onChange={(e) => setProcessingLab(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Camera"
        value={camera}
        onChange={(e) => setCamera(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Lens"
        value={lens}
        onChange={(e) => setLens(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleUpload}>
        <Icon name="upload" className="mr-2" />
        Upload
      </Button>
    </div>
  );
}
