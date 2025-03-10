'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, Download, Bug } from 'lucide-react';
import { MermaidDiagram } from '../MermaidDiagram/MermaidDiagram';
import { toast } from 'sonner';
import mermaid from 'mermaid';

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
  const [debugMode, setDebugMode] = useState(false);

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
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0),
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

  const handleDebugDiagram = async () => {
    try {
      toast.info('Debugging Mermaid code...');

      // Create a temporary container for parsing
      const tempContainer = document.createElement('div');
      tempContainer.style.display = 'none';
      document.body.appendChild(tempContainer);

      try {
        // Parse the diagram to check for syntax errors
        await mermaid.parse(mermaidCode);
        toast.success('Mermaid syntax is valid!');

        // Try to render it to catch rendering errors
        const { svg } = await mermaid.render('debug-diagram', mermaidCode);
        toast.success('Diagram renders successfully!');
      } catch (error) {
        console.error('Mermaid debug error:', error);

        // Show detailed error in toast
        toast.error(
          <div className='space-y-2'>
            <p className='font-medium'>Mermaid Error:</p>
            <p className='text-sm break-words'>
              {error instanceof Error ? error.message : String(error)}
            </p>
          </div>,
          {
            duration: 10000, // Show for 10 seconds
          },
        );
      } finally {
        // Clean up
        document.body.removeChild(tempContainer);
      }
    } catch (error) {
      console.error('Debug function error:', error);
      toast.error('Failed to debug diagram');
    }
  };

  if (!mermaidCode) return null;

  if (isFullScreen) {
    return (
      <div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200'
        onClick={(e) => {
          // Close when clicking the backdrop
          if (e.target === e.currentTarget) {
            setIsFullScreen(false);
          }
        }}
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
      >
        <div
          className='animate-in fade-in flex h-full max-h-screen w-full flex-col rounded-lg shadow-xl duration-200'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex flex-col items-center justify-between border-b p-4 md:flex-row'>
            <h2 id='modal-title' className='text-lg font-semibold'>
              Generated Diagram
            </h2>
            <div className='mt-4 grid grid-cols-2 gap-2 md:mt-0 md:flex md:items-center md:gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsFullScreen(false)}
                aria-label='Close full screen'
              >
                <Minimize2 className='mr-2 h-4 w-4' />
                Exit Full Screen
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleCopyCode}
                aria-label='Copy diagram code'
                className='md:block'
              >
                <div className='flex items-center justify-center'>
                  Copy Code
                </div>
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleSaveImage}
                aria-label='Save diagram as image'
              >
                <Download className='mr-2 h-4 w-4' />
                Save Image
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleDebugDiagram}
                aria-label='Debug Mermaid code'
              >
                <Bug className='mr-2 h-4 w-4' />
                Debug
              </Button>
            </div>
          </div>
          <div className='flex-1 overflow-auto p-4'>
            <div className='flex h-full w-full items-center justify-center'>
              <MermaidDiagram
                code={mermaidCode}
                className='mx-auto h-full w-full'
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
      <CardHeader className='flex flex-col items-center justify-between md:flex-row'>
        <CardTitle>Generated Diagram</CardTitle>
        <div className='mt-4 grid grid-cols-2 gap-2 md:mt-0 md:flex md:items-center md:gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsFullScreen(true)}
            aria-label='View diagram in full screen'
          >
            <Maximize2 className='mr-2 h-4 w-4' />
            Full Screen
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleCopyCode}
            aria-label='Copy diagram code'
            className='md:block'
          >
            <div className='flex items-center justify-center'>Copy Code</div>
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleSaveImage}
            aria-label='Save diagram as image'
          >
            <Download className='mr-2 h-4 w-4' />
            Save Image
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleDebugDiagram}
            aria-label='Debug Mermaid code'
          >
            <Bug className='mr-2 h-4 w-4' />
            Debug
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='h-fit rounded-lg border'>
          <MermaidDiagram
            code={mermaidCode}
            className='max-w-full'
            isFullScreen={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}
