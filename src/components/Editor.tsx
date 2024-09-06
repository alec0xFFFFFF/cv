import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Photo } from './types';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EditorProps {
  photo: Photo;
  onClose: () => void;
  onSubmitEdit: () => void;
  onRegradeEdit: (updatedPhoto: Partial<Photo>) => void;
}

const Editor: React.FC<EditorProps> = ({
  photo,
  onClose,
  onSubmitEdit,
  onRegradeEdit,
}) => {
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isRegrading, setIsRegrading] = useState(false);

  const calculateZoom = (rotation: number) => {
    const radians = (rotation * Math.PI) / 180;
    return 1 / (Math.abs(Math.cos(radians)) + Math.abs(Math.sin(radians)));
  };

  const adjustedZoom = zoom * calculateZoom(rotation);

  const renderSlider = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    onChange: (value: number) => void
  ) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm text-gray-400">{value.toFixed(2)}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
      />
    </div>
  );

  const renderInfoItem = (
    icon: React.ElementType,
    label: string,
    value: string | number | undefined
  ) => {
    if (!value) return null;

    let valueClass = '';
    if (label === 'Quality') {
      const numericValue =
        typeof value === 'string' ? parseFloat(value) : value;
      valueClass =
        numericValue >= 8
          ? 'font-bold rounded-full p-1 bg-green-500'
          : numericValue >= 5
            ? 'font-bold rounded-full p-1 bg-yellow-500'
            : 'font-bold rounded-full p-1 bg-red-500';
      value = `${value}/10`;
    }

    return (
      <div className="flex items-center space-x-2">
        {React.createElement(icon, { size: 16, className: 'text-gray-400' })}
        <span className="text-sm text-gray-300">{label}:</span>
        <span className={`text-sm font-medium text-white ${valueClass}`}>
          {value}
        </span>
      </div>
    );
  };

  const handleRegradeEdit = async () => {
    setIsRegrading(true);
    try {
      const formData = new FormData();
      const response = await fetch(photo.filename);
      const blob = await response.blob();
      formData.append('image', blob, 'image.jpg');
      formData.append('photoId', photo.filename.toString());

      const result = await fetch('/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const data = await result.json();

      const updatedPhoto: Partial<Photo> = {
        quality_grade: data.quality_grade,
        critique: data.critique,
        edit_instructions: data.edit_instructions,
      };

      onRegradeEdit(updatedPhoto);
    } catch (error) {
      console.error('Error regrading image:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsRegrading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors duration-200"
        onClick={onClose}
      >
        <X size={28} />
      </Button>
      <div className="relative w-full h-full max-w-7xl mx-auto p-4 flex flex-col md:flex-row items-center md:items-start overflow-hidden">
        <div className="w-full md:w-2/3 h-1/2 md:h-full flex items-center justify-center mb-4 md:mb-0">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full max-w-full max-h-full aspect-square overflow-hidden shadow-2xl">
                <img
                  src={photo.filename}
                  alt={photo.description || 'Photo'}
                  className="w-full h-full object-cover"
                  style={{
                    filter: `brightness(${brightness + 1}) contrast(${contrast + 1}) saturate(${exposure + 1})`,
                    transform: `rotate(${rotation}deg) scale(${adjustedZoom})`,
                    transformOrigin: 'center center',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <Card className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto bg-gray-900 bg-opacity-80 p-6 rounded-lg mx-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Photo Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderSlider('Brightness', brightness, -1, 1, 0.01, setBrightness)}
            {renderSlider('Contrast', contrast, -1, 1, 0.01, setContrast)}
            {renderSlider('Exposure', exposure, -1, 1, 0.01, setExposure)}
            {renderSlider('Rotation', rotation, 0, 360, 1, setRotation)}
            {renderSlider('Zoom', zoom, 1, 3, 0.1, setZoom)}

            <div className="flex space-x-2">
              <Button
                className="flex-1"
                variant="secondary"
                onClick={handleRegradeEdit}
                disabled={isRegrading}
              >
                {isRegrading ? 'Regrading...' : 'Regrade Edit'}
              </Button>
              <Button className="flex-1" onClick={onSubmitEdit}>
                Submit Edit
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Photo Details</h3>
              <div className="grid grid-cols-1 gap-2">
                {renderInfoItem(Star, 'Quality', photo.quality_grade)}
              </div>
              {photo.critique && (
                <div>
                  <h4 className="text-sm font-semibold">Critique:</h4>
                  <p className="text-sm text-gray-300">{photo.critique}</p>
                </div>
              )}
              {photo.edit_instructions && (
                <div>
                  <h4 className="text-sm font-semibold">Edit Instructions:</h4>
                  <p className="text-sm text-gray-300">
                    {photo.edit_instructions}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Editor;
