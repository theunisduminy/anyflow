'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  code: string;
  className?: string;
  isFullScreen?: boolean;
}

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
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      logLevel: 3,
      fontFamily: 'sans-serif',
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis',
        // Add some spacing controls
        rankSpacing: 30,
        nodeSpacing: 30,
        padding: 15,
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
      },
      gantt: {
        titleTopMargin: 25,
        barHeight: 20,
        barGap: 4,
        topPadding: 50,
        leftPadding: 75,
        gridLineStartPadding: 35,
        fontSize: 11,
        sectionFontSize: 11,
        numberSectionStyles: 4,
      },
      er: {
        diagramPadding: 20,
        layoutDirection: 'TB',
        minEntityWidth: 100,
        minEntityHeight: 75,
        entityPadding: 15,
        stroke: 'gray',
        fill: 'honeydew',
        fontSize: 12,
      },
      pie: {
        textPosition: 0.5,
      },
    });
    setIsReady(true);
    console.log('Mermaid initialized');
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !code || !isReady) {
        console.log('Skipping render - prerequisites not met:', {
          containerExists: !!containerRef.current,
          codeExists: !!code,
          isReady,
        });
        return;
      }

      try {
        console.log('Starting render with code:', code);

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Create the diagram container
        const diagramContainer = document.createElement('div');
        diagramContainer.className = 'mermaid';
        diagramContainer.style.background = 'white';
        diagramContainer.textContent = code;

        // Add to DOM
        containerRef.current.appendChild(diagramContainer);

        // Force a small delay to ensure DOM is ready
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Render the diagram
        await mermaid.run({
          nodes: [diagramContainer],
          suppressErrors: false,
        });

        // Check if rendering worked
        const svg = containerRef.current.querySelector('svg');
        if (svg) {
          console.log('SVG rendered successfully');

          // Allow SVG to use its natural size
          svg.style.maxWidth = 'none';
          svg.style.height = 'auto';
          svg.style.display = 'block';
          svg.removeAttribute('width');
          svg.setAttribute('height', isFullScreen ? '100%' : 'auto');

          // Get the original dimensions from viewBox
          const viewBox = svg.getAttribute('viewBox');
          if (viewBox) {
            const [, , width, height] = viewBox.split(' ').map(Number);

            // Determine if we're in full-screen mode based on className
            const isFullScreenClass =
              className.includes('max-w-[1000vw]') ||
              className.includes('max-h-[80vh]');

            // Use either the prop or the class detection
            const effectiveFullScreen = isFullScreen || isFullScreenClass;

            // Update container height only if not in full screen mode
            if (!effectiveFullScreen) {
              setDiagramHeight(height + 40); // Add padding to original height
            }

            // No scaling transform - display at original size
          }
        } else {
          console.error('No SVG found after rendering');
          throw new Error('Failed to render diagram - no SVG produced');
        }
      } catch (error) {
        console.error('Error rendering diagram:', error);

        // Show error message
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="p-4 text-red-500 border border-red-300 rounded bg-red-50">
              <p class="font-medium">Error rendering diagram</p>
              <p class="text-sm mt-1">Failed to render the diagram. Please check the Mermaid syntax.</p>
              <details class="mt-2">
                <summary class="cursor-pointer text-sm font-medium">View Mermaid Code</summary>
                <pre class="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded">${code
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')}</pre>
              </details>
              <details class="mt-2">
                <summary class="cursor-pointer text-sm font-medium">Error Details</summary>
                <pre class="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded">${String(
                  error
                )
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')}</pre>
              </details>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [code, isReady, isFullScreen]);

  return (
    <div
      ref={containerRef}
      className={`mermaid-container overflow-auto bg-white rounded-lg shadow-sm ${
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
