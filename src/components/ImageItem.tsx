import React, { useState, useEffect } from 'react';

interface Photo {
  description: string;
  filename: string;
  film_format: string;
  film_stock: string;
  similarity_score: number;
}

export const ImageItem: React.FC<{ photo: Photo }> = ({ photo }) => {
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };
    img.src = photo.filename;
  }, [photo.filename]);

  const getGridArea = () => {
    if (aspectRatio > 1.5) return 'span 1 / span 2'; // Wide landscape
    if (aspectRatio < 0.67) return 'span 2 / span 1'; // Tall portrait
    return 'span 1 / span 1'; // Square or close to square
  };

  return (
    <div className="image-item" style={{ gridArea: getGridArea() }}>
      <img src={photo.filename} alt={photo.description} />
      <div className="image-description">{photo.description}</div>
    </div>
  );
};
