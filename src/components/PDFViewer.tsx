import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

const PDFViewer = ({ isOpen, onClose, pdfUrl, title }: PDFViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
    link.click();
  };

  const handleFullscreen = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold truncate pr-4">
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                title="Rotate"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFullscreen}
                title="Open in New Tab"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden bg-muted/20">
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="w-full h-full transition-transform duration-200"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
            >
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-0 rounded-md"
                title={`PDF Viewer - ${title}`}
                loading="lazy"
              />
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 px-6 py-3 border-t bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Use the toolbar above to zoom, rotate, or download the PDF</span>
            <span>Press ESC to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;