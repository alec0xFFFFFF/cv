import { useState } from 'react';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { LoaderFunction, json } from '@remix-run/node';
import { Editor } from '@/components/Editor';

interface LoaderData {
  imageUrl: string;
  photoInfo: Photo; // Assuming Photo type is imported or defined
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const filename = url.searchParams.get('filename');

  if (!filename) {
    throw new Response('Filename is required', { status: 400 });
  }

  const response = await fetch(`/get-image-info/${filename}`);
  if (!response.ok) {
    throw new Response('Failed to fetch image info', {
      status: response.status,
    });
  }

  const data = await response.json();
  return json<LoaderData>({
    imageUrl: data.url,
    photoInfo: data.photoInfo, // Assuming the API returns photo information
  });
};

export default function ImageDisplay() {
  const { imageUrl, photoInfo } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const filename = searchParams.get('filename');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={filename || 'Fullscreen image'}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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
      {isEditorOpen && <Editor photo={photoInfo} onClose={handleCloseEditor} />}
    </div>
  );
}
