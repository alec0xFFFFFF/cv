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
  onRegradeEdit: () => void;
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

    return (
      <div className="flex items-center space-x-2">
        {React.createElement(icon, { size: 16, className: 'text-gray-400' })}
        <span className="text-sm text-gray-300">{label}:</span>
        <span className="text-sm font-medium text-white">{value}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white"
        onClick={onClose}
      >
        <X size={24} />
      </Button>
      <div className="flex w-full h-full max-w-7xl mx-auto p-4">
        <div className="flex-grow mr-2">
          <div className="h-full flex items-center justify-center bg-slate-950 rounded-lg">
            <img
              src={photo.filename}
              alt={photo.description || 'Photo'}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              style={{
                filter: `brightness(${brightness + 1}) contrast(${contrast + 1}) saturate(${exposure + 1})`,
                transform: `rotate(${rotation}deg) scale(${zoom})`,
              }}
            />
          </div>
        </div>
        <Card className="w-96 bg-slate-900 text-white p-4 overflow-y-auto">
          <CardHeader>
            <CardTitle>Photo Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderSlider('Brightness', brightness, -1, 1, 0.01, setBrightness)}
            {renderSlider('Contrast', contrast, -1, 1, 0.01, setContrast)}
            {renderSlider('Exposure', exposure, -1, 1, 0.01, setExposure)}
            {renderSlider('Rotation', rotation, 0, 360, 1, setRotation)}
            {renderSlider('Zoom', zoom, 1, 3, 0.1, setZoom)}

            <Button
              className="flex-1"
              variant="secondary"
              onClick={onRegradeEdit}
            >
              Regrade Edit
            </Button>
            <Button className="flex-1" onClick={onSubmitEdit}>
              Submit Edit
            </Button>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Photo Details</h3>
              <div className="grid grid-cols-2 gap-2">
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
