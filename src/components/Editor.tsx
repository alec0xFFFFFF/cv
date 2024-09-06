import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { X, Star, Move } from 'lucide-react';
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
  const [showGrid, setShowGrid] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanningEnabled, setIsPanningEnabled] = useState(false);
  const isPanning = useRef(false);
  const startPan = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Calculate the aspect ratio of the image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };
    img.src = photo.filename;
  }, [photo.filename]);

  // Function to calculate minimum zoom for proper image covering
  const calculateMinZoom = (rotation: number, aspectRatio: number) => {
    const radians = (rotation * Math.PI) / 180;
    const sinR = Math.abs(Math.sin(radians));
    const cosR = Math.abs(Math.cos(radians));

    // Avoid unnecessary zoom when rotation is 0 or 360
    if (rotation % 360 === 0) {
      return 1;
    }

    if (aspectRatio >= 1) {
      // Landscape or square
      const adj = Math.max(
        sinR + cosR / aspectRatio,
        cosR + sinR / aspectRatio
      );
      console.log('adj', adj);
      return adj;
    } else {
      // Portrait
      return Math.max(sinR * aspectRatio + cosR, cosR * aspectRatio + sinR);
    }
  };

  const minZoom = calculateMinZoom(rotation, aspectRatio);
  const [adjustedZoom, setAdjustedZoom] = useState(1);

  // Adjust zoom when the rotation or zoom state changes
  useEffect(() => {
    const calculatedMinZoom = calculateMinZoom(rotation, aspectRatio);
    setAdjustedZoom(Math.max(zoom, calculatedMinZoom));
  }, [zoom, rotation, aspectRatio]);

  // Handle changes to rotation, ensuring zoom meets minimum covering requirement
  const handleRotationChange = (newRotation: number) => {
    setRotation(newRotation);
    const newMinZoom = calculateMinZoom(newRotation, aspectRatio);
    setZoom((prevZoom) => Math.max(prevZoom, newMinZoom));
  };

  // Handle zoom changes to prevent zooming out beyond minZoom
  const handleZoomChange = (newZoom: number) => {
    const updatedZoom = Math.max(newZoom, minZoom); // Ensure zoom is at least minZoom
    setZoom(updatedZoom); // Update the zoom state directly
  };

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
    } finally {
      setIsRegrading(false);
    }
  };

  // Mouse down event to start panning
  const handleMouseDown = (e: MouseEvent) => {
    if (!isPanningEnabled) return;
    isPanning.current = true;
    startPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  // Mouse move event to update pan position
  const handleMouseMove = (e: MouseEvent) => {
    if (!isPanningEnabled || !isPanning.current || !imageRef.current) return;

    const image = imageRef.current;
    const containerWidth = image.offsetWidth;
    const containerHeight = image.offsetHeight;
    const imageWidth = image.naturalWidth * adjustedZoom;
    const imageHeight = image.naturalHeight * adjustedZoom;

    const maxPanX = Math.max(0, (imageWidth - containerWidth) / 2);
    const maxPanY = Math.max(0, (imageHeight - containerHeight) / 2);

    const newPanX = e.clientX - startPan.current.x;
    const newPanY = e.clientY - startPan.current.y;

    setPan({
      x: Math.max(-maxPanX, Math.min(maxPanX, newPanX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newPanY)),
    });
  };

  // Mouse up event to stop panning
  const handleMouseUp = () => {
    isPanning.current = false;
  };

  // Attach mouse event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const togglePanning = () => {
    setIsPanningEnabled(!isPanningEnabled);
    if (!isPanningEnabled) {
      setPan({ x: 0, y: 0 }); // Reset pan position when enabling panning
    }
  };

  const renderGrid = () => {
    if (!imageRef.current) return null;

    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full grid grid-cols-3 grid-rows-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="border-white relative"
              style={{
                borderWidth: '1px',
                borderTopWidth: i < 3 ? '0' : '1px',
                borderLeftWidth: i % 3 === 0 ? '0' : '1px',
                borderRightWidth: i % 3 === 2 ? '0' : '1px',
                borderBottomWidth: i > 5 ? '0' : '1px',
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: isPanningEnabled ? 'move' : 'default' }}
    >
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
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              ref={imageRef}
              src={photo.filename}
              alt={photo.description || 'Photo'}
              className="max-w-full max-h-full object-contain"
              style={{
                filter: `brightness(${brightness + 1}) contrast(${contrast + 1}) saturate(${exposure + 1})`,
                transform: `rotate(${rotation}deg) scale(${adjustedZoom}) translate(${pan.x}px, ${pan.y}px)`,
              }}
            />
            {showGrid && renderGrid()}
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
            {renderSlider(
              'Rotation',
              rotation,
              0,
              360,
              1,
              handleRotationChange
            )}
            {renderSlider(
              'Zoom',
              zoom,
              minZoom,
              Math.max(minZoom * 3, 3),
              0.01,
              handleZoomChange
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="gridToggle"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label htmlFor="gridToggle" className="text-sm text-gray-300">
                Show Grid Lines
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={togglePanning}
                variant={isPanningEnabled ? 'default' : 'secondary'}
                className="flex items-center space-x-2"
              >
                <Move size={16} />
                <span>
                  {isPanningEnabled ? 'Disable Panning' : 'Enable Panning'}
                </span>
              </Button>
            </div>

            {isPanningEnabled && (
              <p className="text-sm text-gray-300 italic">
                Click and drag the image to pan
              </p>
            )}

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
