'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MermaidDiagramProps } from './types';
import { initializeMermaid } from './mermaidConfig';
import { renderDiagram } from './renderDiagram';

export function MermaidDiagram({
  code,
  className = '',
  isFullScreen = false,
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [diagramHeight, setDiagramHeight] = useState<number | null>(null);

  // Initialize mermaid once when component mounts
  useEffect(() => {
    initializeMermaid();
    setIsReady(true);
  }, []);

  const updateDiagramHeight = useCallback((height: number | null) => {
    setDiagramHeight(height);
  }, []);

  // Render diagram when code, isReady, or isFullScreen changes
  useEffect(() => {
    renderDiagram(
      containerRef,
      code,
      isReady,
      isFullScreen,
      updateDiagramHeight,
    );
  }, [code, isReady, isFullScreen, updateDiagramHeight]);

  return (
    <div
      ref={containerRef}
      className={`mermaid-container overflow-auto rounded-lg bg-white shadow-sm ${
        isFullScreen ? 'h-full' : ''
      } ${className}`}
      style={{
        height: isFullScreen
          ? '100%'
          : diagramHeight
            ? `${diagramHeight}px`
            : 'auto',
        padding: '1rem',
        transition: 'height 0.3s ease-in-out',
        margin: '0 auto',
        display: 'block',
        width: 'auto',
        minWidth: '100%',
      }}
    />
  );
}
