'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DiagramForm } from './DiagramForm';
import { DiagramDisplay } from './DiagramDisplay';
import { Message } from './types';

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
          'No valid Mermaid code was generated. Please try again with a different description.',
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
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate diagram';
      setError(errorMessage);
      toast.error(errorMessage);
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
          'No valid Mermaid code was generated. Please try again with a different prompt.',
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
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to refine diagram';
      setError(errorMessage);
      toast.error(errorMessage);
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
    <div className='container mx-auto space-y-8 py-8'>
      <DiagramForm
        diagramType={diagramType}
        setDiagramType={setDiagramType}
        description={description}
        setDescription={setDescription}
        followUpPrompt={followUpPrompt}
        setFollowUpPrompt={setFollowUpPrompt}
        isGenerating={isGenerating}
        isInitialGeneration={isInitialGeneration}
        error={error}
        handleGenerate={handleGenerate}
        handleRefine={handleRefine}
        handleReset={handleReset}
        mermaidCode={mermaidCode}
        setMermaidCode={setMermaidCode}
      />

      {mermaidCode && (
        <DiagramDisplay
          mermaidCode={mermaidCode}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
          handleCopyCode={handleCopyCode}
        />
      )}
    </div>
  );
}
