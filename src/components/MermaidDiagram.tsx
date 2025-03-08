'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  code: string;
  className?: string;
}

export function MermaidDiagram({ code, className = '' }: MermaidDiagramProps) {
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
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        // Add some spacing controls
        rankSpacing: 30,
        nodeSpacing: 30,
        padding: 15,
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

          // Make SVG responsive
          svg.style.maxWidth = '100%';
          svg.style.height = 'auto';
          svg.style.display = 'block';
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', 'auto');

          // Scale down the diagram if it's too large
          const viewBox = svg.getAttribute('viewBox');
          if (viewBox) {
            const [, , width, height] = viewBox.split(' ').map(Number);
            const scale = Math.min(1, 800 / width); // Scale down if wider than 800px
            const scaledHeight = height * scale;

            // Update container height
            setDiagramHeight(scaledHeight + 40); // Add padding

            // Apply scaling transform
            if (scale < 1) {
              svg.style.transform = `scale(${scale})`;
              svg.style.transformOrigin = 'top left';
            }
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
  }, [code, isReady]);

  return (
    <div
      ref={containerRef}
      className={`mermaid-container overflow-auto w-full bg-white rounded-lg shadow-sm ${className}`}
      style={{
        minHeight: '100px',
        height: diagramHeight ? `${diagramHeight}px` : 'auto',
        padding: '1rem',
        transition: 'height 0.3s ease-in-out',
      }}
    />
  );
}
