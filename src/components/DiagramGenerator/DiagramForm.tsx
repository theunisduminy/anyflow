'use client';

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
import { DIAGRAM_TYPES } from './types';
import mermaid from 'mermaid';
import { toast } from 'sonner';

interface DiagramFormProps {
  diagramType: string;
  setDiagramType: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  followUpPrompt: string;
  setFollowUpPrompt: (value: string) => void;
  isGenerating: boolean;
  isInitialGeneration: boolean;
  error: string | null;
  handleGenerate: () => Promise<void>;
  handleRefine: () => Promise<void>;
  handleReset: () => void;
  mermaidCode: string;
  setMermaidCode: (code: string) => void;
}

export function DiagramForm({
  diagramType,
  setDiagramType,
  description,
  setDescription,
  followUpPrompt,
  setFollowUpPrompt,
  isGenerating,
  isInitialGeneration,
  error,
  handleGenerate,
  handleRefine,
  handleReset,
  mermaidCode,
  setMermaidCode,
}: DiagramFormProps) {
  return (
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

        {/* Test Diagram Button */}
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
  );
}
