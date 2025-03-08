'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, Download } from 'lucide-react';
import { MermaidDiagram } from '../MermaidDiagram';
import { toast } from 'sonner';

interface DiagramDisplayProps {
  mermaidCode: string;
  isFullScreen: boolean;
  setIsFullScreen: (value: boolean) => void;
  handleCopyCode: () => void;
}

export function DiagramDisplay({
  mermaidCode,
  isFullScreen,
  setIsFullScreen,
  handleCopyCode,
}: DiagramDisplayProps) {
  const handleSaveImage = async () => {
    try {
      // Find the SVG element
      const svg = document.querySelector('.mermaid-container svg');
      if (!svg) {
        throw new Error('No diagram found to save');
      }

      // Get SVG dimensions and clone it to modify
      const svgClone = svg.cloneNode(true) as SVGElement;

      // Add required attributes for cross-origin compatibility
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      // Get the computed style of the original SVG
      const styles = window.getComputedStyle(svg);
      const width = parseInt(styles.width);
      const height = parseInt(styles.height);

      // Set explicit dimensions
      svgClone.setAttribute('width', width.toString());
      svgClone.setAttribute('height', height.toString());

      // Create a canvas element with the same dimensions
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not create canvas context');
      }

      // Convert SVG to a data URL
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8',
      });

      // Create a data URL instead of an object URL
      const reader = new FileReader();
      const loadImage = new Promise((resolve, reject) => {
        reader.onload = () => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = reader.result as string;
        };
        reader.onerror = reject;
      });

      reader.readAsDataURL(svgBlob);

      // Wait for image to load and draw it
      const img = (await loadImage) as HTMLImageElement;
      ctx.drawImage(img, 0, 0);

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0)
      );

      // Create download link
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'diagram.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Cleanup
      URL.revokeObjectURL(downloadUrl);

      toast.success('Diagram saved as PNG');
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save diagram as image');
    }
  };

  if (!mermaidCode) return null;

  if (isFullScreen) {
    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200"
        onClick={(e) => {
          // Close when clicking the backdrop
          if (e.target === e.currentTarget) {
            setIsFullScreen(false);
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="bg-white w-full h-full max-h-screen rounded-lg flex flex-col shadow-xl animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 id="modal-title" className="text-lg font-semibold">
              Generated Diagram
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullScreen(false)}
                aria-label="Close full screen"
              >
                <Minimize2 className="h-4 w-4 mr-2" />
                Exit Full Screen
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                aria-label="Copy diagram code"
              >
                Copy Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveImage}
                aria-label="Save diagram as image"
              >
                <Download className="h-4 w-4 mr-2" />
                Save Image
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-gray-50">
            <div className="h-full w-full flex items-center justify-center">
              <MermaidDiagram
                code={mermaidCode}
                className="w-full h-full mx-auto"
                isFullScreen={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Generated Diagram</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullScreen(true)}
            aria-label="View diagram in full screen"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Full Screen
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            aria-label="Copy diagram code"
          >
            Copy Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveImage}
            aria-label="Save diagram as image"
          >
            <Download className="h-4 w-4 mr-2" />
            Save Image
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 bg-white h-fit">
          <MermaidDiagram
            code={mermaidCode}
            className="max-w-full"
            isFullScreen={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}
