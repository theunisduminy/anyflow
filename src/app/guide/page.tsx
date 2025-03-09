'use client';

import { useState } from 'react';
import { DIAGRAM_TYPES } from '@/components/DiagramGenerator/types';
import { DiagramDisplay } from '@/components/DiagramGenerator/DiagramDisplay';
import { diagramExamples } from './diagramExamples';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function GuidePage() {
  const [selectedDiagram, setSelectedDiagram] = useState(DIAGRAM_TYPES[0]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Handle copying Mermaid code to clipboard
  const handleCopyCode = () => {
    const code = diagramExamples[selectedDiagram]?.code;
    if (code) {
      navigator.clipboard
        .writeText(code)
        .then(() => toast.success('Mermaid code copied to clipboard'))
        .catch(() => toast.error('Failed to copy code'));
    }
  };

  return (
    <>
      <div className="container mx-auto py-8 px-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-2">Diagram Types Guide</h1>
        <p className="text-muted-foreground mb-6">
          Choose a flowchart or diagram to see an example and learn how to use
          AnyFlow to generate it.
        </p>
        <div className="mb-6 space-y-2 w-fit flex flex-col md:flex-row gap-x-4 justify-between items-baseline">
          <label
            htmlFor="diagram-select"
            className="block text-base w-full font-medium mb-4"
          >
            Select Diagram Type
          </label>
          <select
            id="diagram-select"
            value={selectedDiagram}
            onChange={(e) => setSelectedDiagram(e.target.value)}
            className="w-fit p-2 border rounded-md"
          >
            {DIAGRAM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6 min-h-screen">
          {diagramExamples[selectedDiagram] ? (
            <>
              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4">
                  {selectedDiagram}
                </h2>
                <p className="text-muted-foreground">
                  {diagramExamples[selectedDiagram]?.explanation}
                </p>
              </div>

              <DiagramDisplay
                key={selectedDiagram} // Force re-render on diagram change
                mermaidCode={diagramExamples[selectedDiagram]?.code || ''}
                isFullScreen={isFullScreen}
                setIsFullScreen={setIsFullScreen}
                handleCopyCode={handleCopyCode}
              />
            </>
          ) : (
            <p className="text-gray-500">
              Example for {selectedDiagram} is coming soon...
            </p>
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
}
