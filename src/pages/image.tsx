import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Editor from '@/components/editor';
import { Photo } from '@/components/types';

interface ImageInfo {
  url: string;
  photoInfo: Photo;
}

export default function ImageDisplay() {
  const router = useRouter();
  const { filename } = router.query;
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    if (filename) {
      fetch(`/api/get-image-info/${filename}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch image info');
          }
          return response.json();
        })
        .then((data) => setImageInfo(data))
        .catch((error) => console.error('Error fetching image info:', error));
    }
  }, [filename]);

  const handleOpenEditor = () => setIsEditorOpen(true);
  const handleCloseEditor = () => setIsEditorOpen(false);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {imageInfo?.url ? (
        <>
          <Image
            src={imageInfo.url}
            alt={typeof filename === 'string' ? filename : 'Fullscreen image'}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            width={100}
            height={100}
          />
          <button
            onClick={handleOpenEditor}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Open Editor
          </button>
        </>
      ) : (
        <p>No image URL available</p>
      )}
      {isEditorOpen && imageInfo?.photoInfo && (
        <Editor
          photo={imageInfo.photoInfo}
          onClose={handleCloseEditor}
          onRegradeEdit={() => {}}
          onSubmitEdit={() => {}}
        />
      )}
    </div>
  );
}
