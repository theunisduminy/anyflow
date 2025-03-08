'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { MermaidDiagram } from '../MermaidDiagram';

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
