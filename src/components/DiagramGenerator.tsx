'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MermaidDiagram } from './MermaidDiagram';
import mermaid from 'mermaid';
import { Maximize2, Minimize2 } from 'lucide-react';

// Define diagram types
const DIAGRAM_TYPES = [
  'Flowchart',
  'Sequence Diagram',
  'Class Diagram',
  'State Diagram',
  'Entity Relationship Diagram',
  'User Journey',
  'Gantt Chart',
  'Pie Chart',
  'Quadrant Chart',
  'Requirement Diagram',
  'Gitgraph Diagram',
  'C4 Diagram',
  'Mindmap',
  'Timeline',
  'Sankey Diagram',
  'XY Chart',
  'Block Diagram',
  'Process Flow',
  'System Diagram',
];

// Define message type for conversation history
type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export function DiagramGenerator() {
  // State for form inputs
  const [diagramType, setDiagramType] = useState<string>('Flowchart');
  const [description, setDescription] = useState<string>('');
  const [followUpPrompt, setFollowUpPrompt] = useState<string>('');

  // State for diagram generation
  const [mermaidCode, setMermaidCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [isInitialGeneration, setIsInitialGeneration] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Handle initial diagram generation
  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('Please enter a description for your diagram');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagramType,
          description,
          history: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate diagram');
      }

      if (!data.mermaidCode) {
        throw new Error(
          'No valid Mermaid code was generated. Please try again with a different description.'
        );
      }

      // Update state with generated diagram
      setMermaidCode(data.mermaidCode);

      // Update conversation history
      const newHistory: Message[] = [
        { role: 'user', content: description },
        { role: 'assistant', content: data.fullResponse },
      ];

      setHistory(newHistory);
      setIsInitialGeneration(false);
      toast.success('Diagram generated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to generate diagram');
      toast.error(error.message || 'Failed to generate diagram');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle diagram refinement
  const handleRefine = async () => {
    if (!followUpPrompt.trim()) {
      toast.error('Please enter a follow-up prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Add user's follow-up prompt to history
      const updatedHistory: Message[] = [
        ...history,
        { role: 'user', content: followUpPrompt },
      ];

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagramType,
          description: followUpPrompt,
          history: updatedHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refine diagram');
      }

      if (!data.mermaidCode) {
        throw new Error(
          'No valid Mermaid code was generated. Please try again with a different prompt.'
        );
      }

      // Update state with refined diagram
      setMermaidCode(data.mermaidCode);

      // Update conversation history
      setHistory([
        ...updatedHistory,
        { role: 'assistant', content: data.fullResponse },
      ]);

      setFollowUpPrompt('');
      toast.success('Diagram refined successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to refine diagram');
      toast.error(error.message || 'Failed to refine diagram');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle copying Mermaid code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(mermaidCode)
      .then(() => toast.success('Mermaid code copied to clipboard'))
      .catch(() => toast.error('Failed to copy code'));
  };

  // Reset the form and start over
  const handleReset = () => {
    setDiagramType('Flowchart');
    setDescription('');
    setFollowUpPrompt('');
    setMermaidCode('');
    setHistory([]);
    setIsInitialGeneration(true);
    setError(null);
    toast.info('Form has been reset');
  };

  // Handle escape key for full screen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullScreen]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Diagram Generator</CardTitle>
          {!isInitialGeneration && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              Start Over
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Diagram Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="diagram-type">Diagram Type</Label>
            <Select
              value={diagramType}
              onValueChange={setDiagramType}
              disabled={isGenerating || !isInitialGeneration}
            >
              <SelectTrigger id="diagram-type" className="w-full">
                <SelectValue placeholder="Select diagram type" />
              </SelectTrigger>
              <SelectContent>
                {DIAGRAM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Initial Description Input */}
          {isInitialGeneration && (
            <div className="space-y-2">
              <Label htmlFor="description">Diagram Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the diagram you want to create..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-32"
                disabled={isGenerating}
              />
            </div>
          )}

          {/* Follow-up Prompt Input (only shown after initial generation) */}
          {!isInitialGeneration && (
            <div className="space-y-2">
              <Label htmlFor="follow-up">Refine Your Diagram</Label>
              <Textarea
                id="follow-up"
                placeholder="Enter a follow-up prompt to refine the diagram..."
                value={followUpPrompt}
                onChange={(e) => setFollowUpPrompt(e.target.value)}
                className="min-h-32"
                disabled={isGenerating}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 text-red-500 border border-red-300 rounded bg-red-50">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Generate/Refine Button */}
          <Button
            onClick={isInitialGeneration ? handleGenerate : handleRefine}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <span className="animate-pulse">Generating...</span>
              </>
            ) : isInitialGeneration ? (
              'Generate Diagram'
            ) : (
              'Refine Diagram'
            )}
          </Button>

          {/* Debug Button - Only visible when mermaid code exists */}
          {mermaidCode && (
            <Button
              onClick={() => {
                console.log('Debug - Raw Mermaid Code:', mermaidCode);
                // Create a test element to check if Mermaid can parse it
                const testElement = document.createElement('div');
                testElement.style.display = 'none';
                testElement.textContent = mermaidCode;
                document.body.appendChild(testElement);

                mermaid
                  .parse(mermaidCode)
                  .then((result: any) => {
                    console.log('Mermaid parse test result:', result);
                    toast.success('Mermaid code is valid');
                  })
                  .catch((error: any) => {
                    console.error('Mermaid parse test error:', error);
                    toast.error('Mermaid code is invalid: ' + error.message);
                  })
                  .finally(() => {
                    document.body.removeChild(testElement);
                  });
              }}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Debug Diagram
            </Button>
          )}

          {/* Test Diagram Button - Always visible */}
          <Button
            onClick={() => {
              const testDiagram = `flowchart TD
    Start[Start] --> Question{Is it working?}
    Question -->|Yes| Good[Great!]
    Question -->|No| Bad[Debug]
    Good --> End[Done]
    Bad --> Question`;

              console.log('Using test diagram:', testDiagram);
              setMermaidCode(testDiagram);
              toast.info('Test diagram loaded');

              // Pre-validate the diagram
              mermaid
                .parse(testDiagram)
                .then(() => console.log('Test diagram syntax is valid'))
                .catch((error) =>
                  console.error('Test diagram syntax error:', error)
                );
            }}
            variant="outline"
            size="sm"
            className="mt-2 ml-2"
          >
            Test Diagram
          </Button>
        </CardContent>
      </Card>

      {/* Diagram Display */}
      {mermaidCode && (
        <>
          {/* Full Screen Modal */}
          {isFullScreen && (
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
          )}

          {/* Normal View */}
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
        </>
      )}
    </div>
  );
}
