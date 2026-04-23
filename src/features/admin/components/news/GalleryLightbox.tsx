import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useKeypress } from '@/hooks/use-keypress';

interface GalleryLightboxProps {
  images: { id: string; image_url: string; caption?: string; alt_text?: string }[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export function GalleryLightbox({ images, initialIndex = 0, open, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Reset to initial index when opening
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setZoomLevel(1);
    }
  }, [open, initialIndex]);

  // Keyboard navigation
  useKeypress('ArrowLeft', () => handlePrevious());
  useKeypress('ArrowRight', () => handleNext());
  useKeypress('Escape', () => onClose());

  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleDownload = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage.image_url;
      link.download = `image-${currentImage.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!currentImage || images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 border-0 outline-none" onInteractOutside={(e) => e.preventDefault()}>
        <div className="relative bg-black aspect-video flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:text-white/80"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 z-10 text-white hover:text-white/80"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 z-10 text-white hover:text-white/80"
            onClick={handleNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Image with zoom */}
          <div className="flex items-center justify-center w-full h-full p-4">
            <div
              className="transition-transform duration-200 ease-in-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={currentImage.image_url}
                alt={currentImage.alt_text || 'Gallery image'}
                className="max-w-full max-h-full object-contain"
                style={{ maxWidth: `${100 / zoomLevel}%`, maxHeight: `${100 / zoomLevel}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <Button variant="secondary" size="icon" onClick={handleZoomOut} className="bg-white/10 hover:bg-white/20">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={handleZoomIn} className="bg-white/10 hover:bg-white/20">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={handleDownload} className="bg-white/10 hover:bg-white/20">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-4 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Caption */}
          {currentImage.caption && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center text-white text-sm max-w-md px-4">
              {currentImage.caption}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}