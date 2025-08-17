import React, { useEffect, useMemo, useState } from 'react';
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
  const [downloading, setDownloading] = useState(false);

  // Normalize URL: if relative (starts with "/"), prefix with origin
  const resolvedUrl = useMemo(() => {
    if (!pdfUrl) return '';
    try {
      // If it's already an absolute URL, URL constructor will work
      new URL(pdfUrl);
      return pdfUrl;
    } catch {
      // Relative path -> resolve against current origin
      return `${window.location.origin}${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;
    }
  }, [pdfUrl]);

  useEffect(() => {
    if (!isOpen) {
      // Reset view state when viewer is closed
      setZoom(100);
      setRotation(0);
      setDownloading(false);
    }
  }, [isOpen]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = async () => {
    if (!resolvedUrl) return;
    setDownloading(true);
    try {
      // Try fetching the file as a blob so downloads work even for same-origin relative paths
      const res = await fetch(resolvedUrl, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch file for download');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (title || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: open in new tab (user can manually download from the browser)
      window.open(resolvedUrl, '_blank', 'noopener');
    } finally {
      setDownloading(false);
    }
  };

  const handleFullscreen = () => {
    if (!resolvedUrl) return;
    window.open(resolvedUrl, '_blank', 'noopener');
  };

  // Compute transform style for the inner iframe wrapper
  const transformStyle: React.CSSProperties = {
    transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
    transformOrigin: 'center top'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b">
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-lg font-semibold truncate pr-4">
              {title || 'PDF Viewer'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 25}
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
                disabled={zoom >= 400}
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
                disabled={downloading}
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

        <div className="flex-1 overflow-auto bg-muted/20">
          {resolvedUrl ? (
            <div className="w-full h-full flex items-start justify-center p-4">
              {/* A wrapper allows the transform (scale/rotate) to apply while the outer container handles scrolling */}
              <div
                className="inline-block bg-white shadow-sm"
                style={{
                  width: 'min(1100px, 95%)',
                  height: 'calc(100vh - 200px)',
                  overflow: 'hidden',
                  ...transformStyle
                }}
                aria-label="PDF container"
              >
                <iframe
                  title={title || 'pdf'}
                  src={resolvedUrl}
                  className="w-full h-full"
                  style={{ border: '0', display: 'block' }}
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No PDF URL provided
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
