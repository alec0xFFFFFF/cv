import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Photo Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            
            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <Icon name="upload" className="text-gray-400 mb-2 w-12 h-12" />
                <p className="text-gray-600">Drag + drop some images here, or click to select files</p>
              </div>
            </div>
            
            {files.length > 0 && (
              <p className="text-sm text-gray-600">{files.length} file(s) selected</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="directory">Directory</Label>
                <Input
                  id="directory"
                  placeholder="Directory"
                  value={directory}
                  onChange={(e) => setDirectory(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filmType">Film Type</Label>
                <Input
                  id="filmType"
                  placeholder="Film Type"
                  value={filmType}
                  onChange={(e) => setFilmType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="processingLab">Processing Lab</Label>
                <Input
                  id="processingLab"
                  placeholder="Processing Lab"
                  value={processingLab}
                  onChange={(e) => setProcessingLab(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="camera">Camera</Label>
                <Input
                  id="camera"
                  placeholder="Camera"
                  value={camera}
                  onChange={(e) => setCamera(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lens">Lens</Label>
                <Input
                  id="lens"
                  placeholder="Lens"
                  value={lens}
                  onChange={(e) => setLens(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleUpload} className="w-full">
              <Icon name="upload" className="mr-2" />
              Upload Photos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
