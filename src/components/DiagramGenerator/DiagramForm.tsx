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
}: DiagramFormProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='mb-2 text-3xl'>
          Create <strong>any</strong> diagram
        </CardTitle>
        {!isInitialGeneration && (
          <Button variant='outline' size='sm' onClick={handleReset}>
            Start Over
          </Button>
        )}
      </CardHeader>
      <CardContent className='space-y-8'>
        {/* Diagram Type Selection */}
        <div className='flex w-fit flex-row items-baseline justify-between space-y-2 gap-x-4'>
          <Label className='w-full min-w-24' htmlFor='diagram-type'>
            Diagram Type:
          </Label>
          <Select
            value={diagramType}
            onValueChange={setDiagramType}
            disabled={isGenerating || !isInitialGeneration}
          >
            <SelectTrigger id='diagram-type' className='w-full'>
              <SelectValue placeholder='Select diagram type' />
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
          <div className='mt-4'>
            <Textarea
              id='description'
              placeholder='Describe the diagram you want to create...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='min-h-32'
              disabled={isGenerating}
            />
          </div>
        )}

        {/* Follow-up Prompt Input (only shown after initial generation) */}
        {!isInitialGeneration && (
          <div className='space-y-2'>
            <Label htmlFor='follow-up'>Refine Your Diagram</Label>
            <Textarea
              id='follow-up'
              placeholder='Enter a follow-up prompt to refine the diagram...'
              value={followUpPrompt}
              onChange={(e) => setFollowUpPrompt(e.target.value)}
              className='min-h-32'
              disabled={isGenerating}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className='rounded border border-red-300 bg-red-50 p-4 text-red-500'>
            <p className='font-medium'>Error</p>
            <p className='mt-1 text-sm'>{error}</p>
          </div>
        )}

        {/* Generate/Refine Button */}
        <Button
          onClick={isInitialGeneration ? handleGenerate : handleRefine}
          disabled={isGenerating}
          className='w-fit'
        >
          {isGenerating ? (
            <>
              <span className='animate-pulse'>Generating...</span>
            </>
          ) : isInitialGeneration ? (
            'Generate Diagram'
          ) : (
            'Refine Diagram'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
