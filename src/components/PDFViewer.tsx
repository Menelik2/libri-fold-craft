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

  // Resolve URL safely when running in the browser. During SSR `window` is undefined,
  // so just return the incoming pdfUrl (relative paths will be resolved by the browser).
  const resolvedUrl = useMemo(() => {
    if (!pdfUrl) return '';
    if (typeof window === 'undefined') {
      // Avoid using window during server-side rendering; return the raw url.
      return pdfUrl;
    }
    try {
      // If it's already an absolute URL, URL constructor will succeed.
      // eslint-disable-next-line no-new
      new URL(pdfUrl);
      return pdfUrl;
    } catch {
      // Treat as relative path -> resolve against current origin
      const prefix = pdfUrl.startsWith('/') ? '' : '/';
      return `${window.location.origin}${prefix}${pdfUrl}`;
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
    if (typeof window === 'undefined') return;
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
      if (typeof window !== 'undefined') {
        window.open(resolvedUrl, '_blank', 'noopener');
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleFullscreen = () => {
    if (!resolvedUrl || typeof window === 'undefined') return;
    window.open(resolvedUrl, '_blank', 'noopener');
  };

  // Use rotation via transform and zoom via the non-standard `zoom` when available.
  // `zoom` provides better layout/scroll behaviour in Chromium-based browsers.
  // For Firefox (no zoom support) scaling will fall back to transform: scale(...) using CSS variable.
  const transformStyle: React.CSSProperties = {
    transform: `rotate(${rotation}deg)`,
    transformOrigin: 'center center',
    // keep display block so rotate behaves predictably
    display: 'block'
  };

  // wrapperZoomStyle sets both zoom (for Chromium) and a fallback scale for browsers without zoom.
  // The fallback uses CSS scale via transform; to avoid double-rotating we only apply scale on an inner element if needed.
  const wrapperStyle: React.CSSProperties = {
    width: 'min(1100px, 95%)',
    height: 'min(80vh, 95%)',
    overflow: 'hidden',
    backgroundColor: 'white',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    // zoom is non-standard but works in most user agents (Chromium-based).
    // We still provide scale fallback for others by using an inline style on the iframe content container.
    // @ts-ignore - `zoom` is non-standard
    zoom: `${zoom}%`
  };

  // fallbackScale used when `zoom` isn't supported; scale is applied to an inner wrapper around the iframe.
  const fallbackScale = zoom / 100;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
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
              {/* Outer wrapper controls overall size and zoom when supported */}
              <div
                className="inline-block"
                style={wrapperStyle}
                aria-label="PDF container"
              >
                {/* Inner wrapper applies rotation and provides a scale fallback for non-zoom browsers */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      display: 'block',
                      // apply rotate to this wrapper
                      ...transformStyle,
                      // fallback scale for browsers that don't support `zoom`
                      transformOrigin: 'center center',
                      // If zoom isn't supported, apply scale as part of transform;
                      // when rotation is also present, make sure scale is included.
                      transform: `rotate(${rotation}deg) scale(${fallbackScale})`
                    }}
                  >
                    <iframe
                      key={`${resolvedUrl}-${zoom}-${rotation}`}
                      title={title || 'pdf'}
                      src={resolvedUrl}
                      className="w-full h-full"
                      style={{ border: '0', display: 'block', width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
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
