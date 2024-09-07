import React, { useState, useEffect, useRef } from 'react';
import { X, Star, Download, RotateCcw } from 'lucide-react';
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
  const isPanning = useRef(false);
  const startPan = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('original');

  // Calculate the aspect ratio and size of the image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.width / img.height);
      setImageSize({ width: img.width, height: img.height });
      // Reset zoom to 1 on initial load
      setZoom(1);
      setAdjustedZoom(1);
    };
    img.src = photo.filename;
  }, [photo.filename]);

  // Adjust container size to fit the image
  useEffect(() => {
    if (containerRef.current && imageSize.width > 0 && imageSize.height > 0) {
      const container = containerRef.current;
      const containerAspectRatio =
        container.clientWidth / container.clientHeight;

      let newWidth, newHeight;
      if (aspectRatio > containerAspectRatio) {
        // Image is wider than container
        newWidth = container.clientWidth;
        newHeight = newWidth / aspectRatio;
      } else {
        // Image is taller than container
        newHeight = container.clientHeight;
        newWidth = newHeight * aspectRatio;
      }

      container.style.width = `${newWidth}px`;
      container.style.height = `${newHeight}px`;
    }
  }, [imageSize, aspectRatio]);

  const calculateMinZoom = (rotation: number) => {
    const radians = (rotation * Math.PI) / 180;
    const sinR = Math.abs(Math.sin(radians));
    const cosR = Math.abs(Math.cos(radians));
    return Math.max(1, (sinR + cosR) / Math.min(aspectRatio, 1 / aspectRatio));
  };

  const minZoom = calculateMinZoom(rotation);
  const [adjustedZoom, setAdjustedZoom] = useState(1);

  useEffect(() => {
    setAdjustedZoom(Math.max(zoom, minZoom));
  }, [zoom, minZoom]);

  const handleRotationChange = (newRotation: number) => {
    setRotation(newRotation);
    const newMinZoom = calculateMinZoom(newRotation);
    setZoom((prevZoom) => Math.max(prevZoom, newMinZoom));
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.max(newZoom, minZoom));
  };

  const renderSlider = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    onChange: (value: number) => void,
    unit: string
  ) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm text-gray-400">
          {value.toFixed(2)}
          {unit}
        </span>
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
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === containerRef.current) {
      e.preventDefault();
      isPanning.current = true;
      startPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  // Mouse move event to update pan position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning.current || !imageRef.current) return;

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
    const handleMouseMoveWrapper = (e: globalThis.MouseEvent) => {
      if (isPanning.current) {
        handleMouseMove({
          clientX: e.clientX,
          clientY: e.clientY,
          preventDefault: e.preventDefault.bind(e),
        } as React.MouseEvent<HTMLDivElement>);
      }
    };

    window.addEventListener('mousemove', handleMouseMoveWrapper);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveWrapper);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

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

  const aspectRatios = [
    { label: 'Original', value: 'original' },
    { label: '1:1', value: '1:1' },
    { label: '4:3', value: '4:3' },
    { label: '16:9', value: '16:9' },
    { label: '3:2', value: '3:2' },
  ];

  const handleAspectRatioChange = (value: string) => {
    setSelectedAspectRatio(value);
    if (value !== 'original') {
      const [width, height] = value.split(':').map(Number);
      const newAspectRatio = width / height;
      setAspectRatio(newAspectRatio);

      // Reset container size based on the new aspect ratio
      if (containerRef.current) {
        const container = containerRef.current;
        const parentWidth = container.parentElement?.offsetWidth || 0;
        const parentHeight = container.parentElement?.offsetHeight || 0;

        if (newAspectRatio > parentWidth / parentHeight) {
          // Fit to width
          container.style.width = `${parentWidth}px`;
          container.style.height = `${parentWidth / newAspectRatio}px`;
        } else {
          // Fit to height
          container.style.height = `${parentHeight}px`;
          container.style.width = `${parentHeight * newAspectRatio}px`;
        }
      }
    } else {
      // Reset to original aspect ratio and size
      const originalAspectRatio = imageSize.width / imageSize.height;
      setAspectRatio(originalAspectRatio);
      if (containerRef.current) {
        const container = containerRef.current;
        const parentWidth = container.parentElement?.offsetWidth || 0;
        const parentHeight = container.parentElement?.offsetHeight || 0;

        if (originalAspectRatio > parentWidth / parentHeight) {
          // Fit to width
          container.style.width = `${parentWidth}px`;
          container.style.height = `${parentWidth / originalAspectRatio}px`;
        } else {
          // Fit to height
          container.style.height = `${parentHeight}px`;
          container.style.width = `${parentHeight * originalAspectRatio}px`;
        }
      }
    }

    // Reset pan and zoom
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setAdjustedZoom(1);
  };

  const handleDownload = () => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match the container
    canvas.width = containerRef.current.offsetWidth;
    canvas.height = containerRef.current.offsetHeight;

    // Apply background color if needed
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate the position and size of the image within the canvas
    const containerAspectRatio = canvas.width / canvas.height;
    const imageAspectRatio = imageRef.current.naturalWidth / imageRef.current.naturalHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (containerAspectRatio > imageAspectRatio) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imageAspectRatio;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imageAspectRatio;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    }

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(adjustedZoom, adjustedZoom);
    ctx.translate(-canvas.width / 2 + pan.x, -canvas.height / 2 + pan.y);

    // Draw the image
    ctx.drawImage(imageRef.current, drawX, drawY, drawWidth, drawHeight);

    // Restore context
    ctx.restore();

    // Apply filters
    ctx.filter = `brightness(${brightness + 1}) contrast(${contrast + 1}) saturate(${exposure + 1})`;
    ctx.drawImage(canvas, 0, 0);

    // Create download link
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'edited_image.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  // Add these state variables for initial values
  const [initialBrightness] = useState(0);
  const [initialContrast] = useState(0);
  const [initialExposure] = useState(0);
  const [initialRotation] = useState(0);
  const [initialZoom] = useState(1);
  const [initialPan] = useState({ x: 0, y: 0 });

  // Add this function to reset all values
  const handleResetChanges = () => {
    setBrightness(initialBrightness);
    setContrast(initialContrast);
    setExposure(initialExposure);
    setRotation(initialRotation);
    setZoom(initialZoom);
    setPan(initialPan);
    setAdjustedZoom(initialZoom);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
      style={{ cursor: isPanning.current ? 'move' : 'default' }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 z-50"
        onClick={onClose}
      >
        <X size={24} />
      </Button>
      <div className="relative w-full h-full max-w-7xl mx-auto p-4 flex flex-col md:flex-row items-center md:items-start overflow-hidden">
        <div className="w-full md:w-2/3 h-1/2 md:h-full flex items-center justify-center mb-4 md:mb-0">
          <div
            ref={containerRef}
            className="relative flex items-center justify-center overflow-hidden"
            style={{
              width: '100%',
              height: '100%',
              aspectRatio: aspectRatio,
              cursor: isPanning.current ? 'move' : 'default',
            }}
            onMouseDown={handleMouseDown}
          >
            <img
              ref={imageRef}
              src={photo.filename}
              alt={photo.description || 'Photo'}
              className="max-w-none max-h-none"
              style={{
                filter: `brightness(${brightness + 1}) contrast(${contrast + 1}) saturate(${exposure + 1})`,
                transform: `rotate(${rotation}deg) scale(${adjustedZoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: 'center',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              draggable={false}
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Aspect Ratio
              </label>
              <div className="flex flex-wrap gap-2">
                {aspectRatios.map((ratio) => (
                  <Button
                    key={ratio.value}
                    onClick={() => handleAspectRatioChange(ratio.value)}
                    variant={
                      selectedAspectRatio === ratio.value
                        ? 'default'
                        : 'secondary'
                    }
                    size="sm"
                    className="flex-grow"
                  >
                    {ratio.label}
                  </Button>
                ))}
              </div>
            </div>

            {renderSlider(
              'Brightness',
              brightness,
              -1,
              1,
              0.01,
              setBrightness,
              '%'
            )}
            {renderSlider('Contrast', contrast, -1, 1, 0.01, setContrast, '%')}
            {renderSlider('Exposure', exposure, -1, 1, 0.01, setExposure, 'EV')}
            {renderSlider(
              'Rotation',
              rotation,
              0,
              360,
              1,
              handleRotationChange,
              '°'
            )}
            {renderSlider(
              'Zoom',
              zoom,
              minZoom,
              Math.max(6, minZoom * 1.5),
              0.01,
              handleZoomChange,
              'x'
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

            <Button
              className="w-full"
              onClick={handleDownload}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Edited Image
            </Button>

            <Button
              className="w-full mt-2"
              onClick={handleResetChanges}
              variant="outline"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Undo All Changes
            </Button>

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
